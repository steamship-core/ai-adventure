import { Adventure } from "@prisma/client";
import { log } from "next-axiom";
import { createAgent } from "../agent/agent.server";
import prisma from "../db";
import { getTopLevelUpdatesFromAdventureConfig } from "../editor/editor-types";
import { getOrCreateUserApprovals } from "../editor/user-approvals.server";
import { sendSlackMessage } from "../slack/slack.server";
import {
  getServerSettingsFromAgent,
  pushServerSettingsToAgent,
  requestMagicCreation,
} from "./adventure-agent.server";

export const getAdventures = async (limit?: number, onlyPublic?: boolean) => {
  return prisma.adventure.findMany({
    ...(limit && { take: limit }),
    orderBy: {
      createdAt: "desc",
    },
    where: {
      ...(onlyPublic === true ? { public: true } : {}),
    },
  });
};

export const getAdventure = async (
  adventureId: string,
  includeDevAgent: boolean = false
) => {
  const ret = await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      // Only if it isn't null
      deletedAt: null,
    },
    include: {
      devAgent: true,
      NarrativeSnippet: {
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (ret?.id != adventureId) {
    throw new Error(`Asked for adventureId ${adventureId} but got ${ret?.id}`);
  }
  return ret;
};

export const getAdventureForUser = async (
  userId: string,
  adventureId: string,
  includeDevAgent: boolean = false
) => {
  const includeBit = includeDevAgent
    ? {
        include: {
          devAgent: true,
        },
      }
    : {};

  const ret = await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      creatorId: userId,
    },
    ...includeBit,
  } as any);

  if (ret?.id != adventureId) {
    throw new Error(`Asked for adventureId ${adventureId} but got ${ret?.id}`);
  }
  return ret;
};

export const getAdventuresForUser = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: {
      creatorId: userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createAdventure = async ({
  creatorId,
  createdBy,
  name,
  description,
  agentVersion,
}: {
  creatorId: string;
  createdBy: string;
  name: string;
  description: string;
  agentVersion: string;
}) => {
  log.info(
    `createAdventure -  User ${creatorId}; Agent Version ${agentVersion}`
  );

  try {
    let adventure = await prisma.adventure.create({
      data: {
        creatorId,
        createdBy,
        name,
        description,
        agentVersion,
      },
    });

    await sendSlackMessage(`🚢 User ${creatorId} created a new Adventure!`);

    return createDevAgentForAdventureAndReturnAdventure(adventure);
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create adventure.");
  }
};

export const createDevAgentForAdventureAndReturnAdventure = async (
  adventure: Adventure
) => {
  log.info(
    `createDevAgentForAdventureAndReturnAdventure -  Adventure ${adventure.id}; Agent Version ${adventure.agentVersion}`
  );

  const devAgent = await createAgent(adventure.creatorId, adventure.id, true);

  if (!devAgent) {
    throw Error(`Failed to create dev agent for adventure ${adventure.id}`);
  }

  log.info(`Setting Adventure ${adventure.id} to use dev agent ${devAgent.id}`);

  return await prisma.adventure.update({
    where: { id: adventure.id },
    data: {
      devAgentId: devAgent!.id!,
    },
  });
};

export const updateAdventure = async (
  userId: string,
  adventureId: string,
  updateObj: any
) => {
  log.info(`updateAdventure -  UserId ${userId} AdventureId ${adventureId}`);

  const adventure = await getAdventure(adventureId, true);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  let publicModifiers = {};

  if (updateObj.adventure_public === true) {
    const userApproval = await getOrCreateUserApprovals(userId);
    if (!userApproval.isApproved) {
      log.info(`Warning: User ${userId} is not approved for public adventures`);
      log.warn(`Warning: User ${userId} is not approved for public adventures`);
      updateObj.adventure_public = false;
      updateObj.adventure_public_requested = true;
      publicModifiers = {
        public: false,
        publicRequested: true,
      };
      await sendSlackMessage(
        `👋 User ${userId} requested public approval: ${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/${adventure.id} if you approve, use this link and set the approval key: ${process.env.NEXT_PUBLIC_WEB_BASE_URL}/api/admin/approve?adventureId=${adventure.id}&approveKey=`,
        process.env.SLACK_APPROVAL_CHANNEL_ID
      );
    } else {
      publicModifiers = {
        public: true,
        publicRequested: false,
      };
      await sendSlackMessage(`User ${userId} set ${adventure.id} to PUBLIC`);
    }
  } else if (updateObj.adventure_public === false) {
    publicModifiers = {
      public: false,
    };
    await sendSlackMessage(`User ${userId} set ${adventure.id} to PRIVATE`);
  }

  try {
    const topLevelUpdates = getTopLevelUpdatesFromAdventureConfig(updateObj);
    const priorAgentVersion = adventure.agentVersion;
    const createNewDevAgent =
      topLevelUpdates.agentVersion &&
      topLevelUpdates.agentVersion != priorAgentVersion;

    // Before we save it, we need to try to load it into the development
    // agent. This will trigger any sanity checks on the new configuration that -- if they throw an error --
    // should block the saving!
    const updatedServerSettings = {
      ...(adventure.agentDevConfig as object),
      ...updateObj,
    };
    if (adventure.devAgent) {
      const devAgent = adventure.devAgent;
      const resp = await pushServerSettingsToAgent(
        devAgent.agentUrl,
        updatedServerSettings
      );

      if (!resp.ok) {
        throw new Error(await resp.text());
      }
    }

    let newAdventure = await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...topLevelUpdates,
        ...publicModifiers,
        agentDevConfig: updatedServerSettings,
        version: {
          increment: 1,
        },
      },
    });

    // If the updated data contained
    if (createNewDevAgent) {
      log.info(`Creating new dev agent for adventure ${adventure.id}.`);
      newAdventure = await createDevAgentForAdventureAndReturnAdventure(
        newAdventure
      );
    }

    return newAdventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw e;
  }
};

export const approveAdventure = async (adventureId: string) => {
  log.info(`approveAdventure - AdventureId ${adventureId}`);
  try {
    let newAdventure = await prisma.adventure.update({
      where: { id: adventureId },
      data: {
        public: true,
        publicRequested: false,
      },
    });
    return newAdventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw e;
  }
};

export const magicCreateAdventure = async (
  userId: string,
  adventureId: string,
  updateObj: any
) => {
  log.info(
    `magicCreateAdventure -  UserId ${userId} AdventureId ${adventureId}`
  );

  const adventure = await getAdventure(adventureId, true);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  try {
    const topLevelUpdates = getTopLevelUpdatesFromAdventureConfig(updateObj);

    // Before we save it, we need to try to load it into the development
    // agent. This will trigger any sanity checks on the new configuration that -- if they throw an error --
    // should block the saving!
    const updatedServerSettings = {
      ...(adventure.agentDevConfig as object),
      ...updateObj,
    };

    // TODO: We're sending too many values up -- should just be what's on that magic page.

    const devAgent = (adventure as any).devAgent;
    const resp = await requestMagicCreation(
      devAgent.agentUrl,
      updatedServerSettings
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    const result = await resp.json();
    const taskId = result?.taskId;

    log.info(
      `magicCreateAdventure -  UserId ${userId} AdventureId ${adventureId} TaskId ${taskId}`
    );

    const updateData = {
      ...topLevelUpdates,
      agentDevConfig: updatedServerSettings,
      ...{
        state: "generating",
        stateTaskId: taskId,
        stateUpdatedAt: new Date(),
      },
    } as any;

    console.log(taskId);

    let newAdventure = await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...updateData,
        version: {
          increment: 1,
        },
      },
    });
    return newAdventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw e;
  }
};

export const syncAdventureStateWithAgent = async (
  userId: string,
  adventureId: string
) => {
  log.info(
    `syncAdventureStateWithAgent -  UserId ${userId} AdventureId ${adventureId}`
  );

  const adventure = await getAdventure(adventureId, true);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  try {
    const devAgent = (adventure as any).devAgent;
    const serverSettings = await getServerSettingsFromAgent(devAgent.agentUrl);
    const generationTaskId = serverSettings.generation_task_id;
    console.log(
      `Agent server settings has generation_task_id: ${generationTaskId}`
    );

    let data = {
      state: generationTaskId ? "generating" : "ready",
      stateUpdatedAt: new Date(),
      stateTaskId: null,
    };

    const oldState = adventure.state;
    const newState = data.state;

    if (oldState == newState) {
      log.info(
        `syncAdventureStateWithAgent -  UserId ${userId} AdventureId ${adventureId} State ${newState} (NO CHANGE)`
      );

      if (newState == "generating") {
        if (serverSettings.generation_task_id) {
          // TODO: We need to check to make sure the task hasn't failed.
          // If it has, it will endlessly be stuck generating here.
        }
      }
      return adventure;
    }

    if (oldState == "generating" && newState == "ready") {
      console.log(
        `Got adventure template from agent: ${JSON.stringify(
          serverSettings,
          undefined,
          2
        )}`
      );

      const newDevConfig = {
        ...serverSettings,
      } as any;

      (data as any).agentDevConfig = newDevConfig;
      (data as any).name = newDevConfig.name;
      (data as any).shortDescription = newDevConfig.short_description;
      (data as any).description = newDevConfig.description;
      (data as any).tags = newDevConfig.tags || [];
      (data as any).image = newDevConfig.image;
      (data as any).state = newState;

      console.log("Updating database record with:");
      console.log((data as any).agentDevConfig);
    }

    let newAdventure = await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...data,
        version: {
          increment: 1,
        },
      },
    });

    console.log(
      `syncAdventureStateWithAgent -  UserId ${userId} AdventureId ${adventureId} State: ${oldState} -> ${newState}`
    );
    log.info(
      `syncAdventureStateWithAgent -  UserId ${userId} AdventureId ${adventureId} State: ${adventure.state} -> ${newAdventure.state}`
    );

    return newAdventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw e;
  }
};

export const deleteAdventure = async (userId: string, adventureId: string) => {
  log.info(`User ${userId} attempting to delete adventure ${adventureId}`);
  const adventure = await getAdventure(adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId} for user ${userId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  try {
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        deletedAt: new Date(),
        version: {
          increment: 1,
        },
      },
    });
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to delete adventure.");
  }
};

export const publishAdventure = async (userId: string, adventureId: string) => {
  const adventure = await getAdventure(adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  const oldConfig = adventure.agentConfig || {};
  const newConfig = adventure.agentDevConfig || {};

  log.info(
    `Publishing adventure. Old config was  ${JSON.stringify(oldConfig)}.`
  );

  try {
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        agentConfig: newConfig,
      },
    });
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};

export const importAdventure = async (
  userId: string,
  adventureId: string,
  importObj: any
) => {
  const adventure = await getAdventure(adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  const oldConfig = adventure.agentConfig || {};

  log.info(
    `Importing adventure. Old config was  ${JSON.stringify(oldConfig)}.`
  );

  if (importObj.adventure_public === true) {
    const userApproval = await getOrCreateUserApprovals(userId);
    if (!userApproval.isApproved) {
      log.info(`Warning: User ${userId} is not approved for public adventures`);
      log.warn(`Warning: User ${userId} is not approved for public adventures`);
      importObj.adventure_public = false;
    }
  }

  try {
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...getTopLevelUpdatesFromAdventureConfig(importObj),
        agentDevConfig: importObj,
        version: {
          increment: 1,
        },
      },
    });
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
