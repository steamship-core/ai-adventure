"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function addFeedback({
  isPositive,
  feedback = "",
  url = "",
}: {
  isPositive: boolean;
  feedback?: string;
  url?: string;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("No user");

  const fb = await prisma.feedback.create({
    data: {
      userId: userId,
      isPositive,
      feedback,
      url,
    },
  });
  return fb;
}

export async function updateFeedback(
  id: string,
  {
    isPositive,
    feedback = "",
    url = "",
  }: {
    isPositive: boolean;
    feedback?: string;
    url?: string;
  }
) {
  const { userId } = auth();
  if (!userId) throw new Error("No user");

  const fb = await prisma.feedback.update({
    where: {
      id,
      userId: userId,
    },
    data: {
      userId: userId,
      isPositive,
      feedback,
      url,
    },
  });
  return fb;
}
