"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(45)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export const updateUserInfo = async ({ username }: { username: string }) => {
  const validatedFields = schema.safeParse({
    username,
  });
  if (!validatedFields.success) {
    return {
      error: `Invalid username.
• Usernames may contain letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-).
• Usernames must be between 3-45 characters long.`,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("No user ID");
  }

  try {
    await prisma.userInfo.update({
      where: {
        userId,
      },
      data: {
        username: validatedFields.data.username.trim(),
      },
    });
    revalidatePath("/account");
  } catch (e) {
    console.error(e);
    return {
      error: "Username is already taken",
    };
  }
};
