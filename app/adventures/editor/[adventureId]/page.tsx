import SettingGroupForm from "@/components/editor/setting-group-form";
import { getAdventure } from "@/lib/adventure/adventure.server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

export default async function EditorPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(params.adventureId);
  if (!adventure) {
    log.error("No adventure");
    throw new Error("no adventure");
  }
  if (adventure.creatorId != userId) {
    log.error(
      `User ${userId} does not have permission to edit ${adventure.id}`
    );
    redirect("/adventures");
  }

  if (!adventure) {
    redirect("/adventures");
  }

  const userApproval = await prisma.userApprovals.findFirst({
    where: {
      userId: userId,
    },
  });
  let config = {
    adventure_name: adventure.name,
    adventure_description: adventure.description,
    image: adventure.image,
    ...((adventure.agentDevConfig as any) || {}),
  };

  return (
    <SettingGroupForm
      existing={config}
      isUserApproved={userApproval?.isApproved || false}
    />
  );
}
