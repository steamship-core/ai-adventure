"use server";

import { auth } from "@clerk/nextjs";
import prisma from "../db";

export async function isUserAdmin(): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userInfo = await prisma.userInfo.findUnique({
    where: {
      userId,
    },
  });

  return userInfo?.isAdmin === true;
}
