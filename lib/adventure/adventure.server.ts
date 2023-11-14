import { log } from "next-axiom";
import { createAgent } from "../agent/agent.server";
import prisma from "../db";
import { getTopLevelUpdatesFromAdventureConfig } from "../editor/editor-options";
import { getOrCreateUserApprovals } from "../editor/user-approvals.server";

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

export const getAdventure = async (adventureId: string) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      // Only if it isn't null
      deletedAt: null,
    },
  });
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

  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      creatorId: userId,
    },
    ...includeBit,
  } as any);
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

    const devAgent = await createAgent(creatorId, adventure.id, true);

    return await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        devAgentId: devAgent!.id!,
      },
    });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create adventure.");
  }
};

export const updateAdventure = async (
  userId: string,
  adventureId: string,
  updateObj: any
) => {
  console.log(`User ${userId} attempting to update adventure ${adventureId}`);
  const adventure = await getAdventure(adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  if (updateObj.adventure_public === true) {
    const userApproval = await getOrCreateUserApprovals(userId);
    if (!userApproval.isApproved) {
      console.log(
        `Warning: User ${userId} is not approved for public adventures`
      );
      log.warn(`Warning: User ${userId} is not approved for public adventures`);
      updateObj.adventure_public = false;
    }
  }

  try {
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        ...getTopLevelUpdatesFromAdventureConfig(updateObj),
        agentDevConfig: {
          ...(adventure.agentDevConfig as object),
          ...updateObj,
        },
      },
    });
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to update adventure.");
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
