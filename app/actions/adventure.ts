"use server";

import prisma from "@/lib/db";
import { TopLevelSpecialCases } from "@/lib/editor/DEPRECATED-editor-options";
import { auth } from "@clerk/nextjs";

export const resetDevAgent = async (id: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("No user");

  const adventure = await prisma.adventure.findUnique({
    where: {
      id,
      creatorId: userId,
    },
  });
  const settingsToSave = {};
  for (const key of Object.keys(TopLevelSpecialCases)) {
    // @ts-ignore
    if (adventure?.agentConfig?.[key]) {
      // @ts-ignore
      settingsToSave[TopLevelSpecialCases[key]] = adventure?.agentConfig?.[key];
    }
  }

  await prisma.adventure.update({
    where: {
      id,
      creatorId: userId,
    },
    data: {
      ...settingsToSave,
      agentDevConfig: adventure?.agentConfig || {},
      version: {
        increment: 1,
      },
    },
  });
};
