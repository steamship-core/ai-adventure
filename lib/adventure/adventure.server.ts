import { Adventure } from "@prisma/client";
import { log } from "next-axiom";
import prisma from "../db";

export const getAdventures = async (limit?: number) => {
  return prisma.adventure.findMany({
    ...(limit && { take: limit }),
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAdventure = async (adventureId: string) => {
  return (await prisma.adventure.findFirst({
    where: {
      id: adventureId,
    },
  })) as Adventure;
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
  const adventure: Adventure = await getAdventure(userId, adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  try {
    let devConfig: Record<string, any> = {
      ...(adventure.agentDevConfig as object),
    };

    for (const [key, value] of Object.entries(updateObj)) {
      console.log("set", key, value);
      if (key == "adventure_name") {
        // Special Case 1
        adventure.name = value as string;
      } else if (key == "adventure_description") {
        adventure.description = value as string;
        // Special Case 2
      } else {
        devConfig[key as string] = value;
      }
    }

    adventure.agentDevConfig = devConfig;
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        name: adventure.name,
        description: adventure.description,
        agentDevConfig: devConfig,
      },
    });

    console.log(`Updated adventure ${adventure.id}`);
    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};

export const publishAdventure = async (
  userId: string,
  adventureId: string,
  updateObj: any
) => {
  const adventure: Adventure = await getAdventure(userId, adventureId);

  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  if (adventure.creatorId !== userId) {
    throw Error(`Adventure ${adventureId} was not created by user ${userId}.}`);
  }

  console.log(
    `Publishing adventure. Old config was  ${JSON.stringify(
      adventure.agentConfig
    )}.`
  );
  log.info(
    `Publishing adventure. Old config was  ${JSON.stringify(
      adventure.agentConfig
    )}.`
  );

  try {
    adventure.agentConfig = adventure.agentDevConfig;
    await prisma.adventure.update({
      where: { id: adventure.id },
      data: {
        agentConfig: adventure.agentDevConfig as any,
      },
    });

    return adventure;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
