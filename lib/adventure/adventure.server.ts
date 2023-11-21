import { Adventure } from "@prisma/client";
import { log } from "next-axiom";
import { createAgent } from "../agent/agent.server";
import prisma from "../db";
import { getTopLevelUpdatesFromAdventureConfig } from "../editor/DEPRECATED-editor-options";
import { getOrCreateUserApprovals } from "../editor/user-approvals.server";
import { sendSlackMessage } from "../slack/slack.server";
import { pushServerSettingsToAgent } from "./adventure-agent.server";

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
      // Only if it isn't null
      deletedAt: null,
    },
    ...includeBit,
  } as any);

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
  console.log(
    `createAdventure -  User ${creatorId}; Agent Version ${agentVersion}`
  );
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
  console.log(
    `createDevAgentForAdventureAndReturnAdventure -  Adventure ${adventure.id}; Agent Version ${adventure.agentVersion}`
  );
  log.info(
    `createDevAgentForAdventureAndReturnAdventure -  Adventure ${adventure.id}; Agent Version ${adventure.agentVersion}`
  );

  const devAgent = await createAgent(adventure.creatorId, adventure.id, true);

  if (!devAgent) {
    throw Error(`Failed to create dev agent for adventure ${adventure.id}`);
  }

  console.log(
    `Setting Adventure ${adventure.id} to use dev agent ${devAgent.id}`
  );

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
  console.log(`updateAdventure -  UserId ${userId} AdventureId ${adventureId}`);
  log.info(`updateAdventure -  UserId ${userId} AdventureId ${adventureId}`);

  console.log(`User ${userId} attempting to update adventure ${adventureId}`);
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
      console.log(
        `Warning: User ${userId} is not approved for public adventures`
      );
      log.warn(`Warning: User ${userId} is not approved for public adventures`);
      updateObj.adventure_public = false;
      updateObj.adventure_public_requested = true;
      publicModifiers = {
        public: false,
        publicRequested: true,
      };
      await sendSlackMessage(
        `👋 User ${userId} requested ${adventure.id} to be approved to be PUBLIC`
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
    const devAgent = (adventure as any).devAgent;
    const resp = await pushServerSettingsToAgent(
      devAgent.agentUrl,
      updatedServerSettings
    );

    if (!resp.ok) {
      throw new Error(await resp.text());
    }

    let newAdventure = await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...topLevelUpdates,
        ...publicModifiers,
        agentDevConfig: updatedServerSettings,
      },
    });

    // If the updated data contained
    if (createNewDevAgent) {
      log.info(`Creating new dev agent for adventure ${adventure.id}.`);
      newAdventure = await createDevAgentForAdventureAndReturnAdventure(
        newAdventure
      );
    }

    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw e;
  }
};

export const deleteAdventure = async (userId: string, adventureId: string) => {
  console.log(`User ${userId} attempting to delete adventure ${adventureId}`);
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

  console.log(
    `Publishing adventure. Old config was  ${JSON.stringify(oldConfig)}.`
  );
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

  console.log(
    `Importing adventure. Old config was  ${JSON.stringify(oldConfig)}.`
  );
  log.info(
    `Importing adventure. Old config was  ${JSON.stringify(oldConfig)}.`
  );

  if (importObj.adventure_public === true) {
    const userApproval = await getOrCreateUserApprovals(userId);
    if (!userApproval.isApproved) {
      console.log(
        `Warning: User ${userId} is not approved for public adventures`
      );
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
      },
    });
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
