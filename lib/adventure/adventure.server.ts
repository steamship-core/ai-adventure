import { log } from "next-axiom";
import prisma from "../db";

export const getAdventures = async () => {
  return prisma.adventure.findMany({});
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
