import { log } from "next-axiom";
import prisma from "../db";
import { getTopLevelUpdatesFromAdventureConfig } from "../editor/editor-options";

export const getAdventures = async (limit?: number) => {
  return prisma.adventure.findMany({
    ...(limit && { take: limit }),
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAdventure = async (adventureId: string) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
    },
  });
};

export const getAdventureForUser = async (
  userId: string,
  adventureId: string
) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      creatorId: userId,
    },
  });
};

export const getAdventuresForUser = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: {
      creatorId: userId,
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
    return await prisma.adventure.create({
      data: {
        creatorId,
        createdBy,
        name,
        description,
        agentVersion,
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
    throw Error("Failed to create agent.");
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
