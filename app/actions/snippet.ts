"use server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const createSnippet = async (text: string, adventureId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("No user");

  const snippet = await prisma.narrativeSnippet.create({
    data: {
      text,
      userId,
      adventureId,
    },
  });
  return snippet;
};
