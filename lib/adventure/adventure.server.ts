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
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
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
