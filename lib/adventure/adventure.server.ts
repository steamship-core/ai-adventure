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

export const getAdventure = async (userId: string, adventureId: string) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      creatorId: userId,
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
  const adventure = await getAdventure(userId, adventureId);
  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  try {
    console.log("updateAdventure", updateObj, adventureId);
    console.log("TODO: Update field of adventure object.");
    console.log("TODO: Save adventure object.");
    return {};
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
