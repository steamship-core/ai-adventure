import Editor from "@/components/editor/editor";
import { getAdventure } from "@/lib/adventure/adventure.server";
import prisma from "@/lib/db";
import { objectEquals } from "@/lib/utils";
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

  let innerConfig = (adventure.agentDevConfig as any) || {};

  let devConfig = {
    ...((adventure.agentDevConfig as any) || {}),
    adventure_name: adventure.name, // Backwards compatible
    name: adventure.name,
    adventure_description: adventure.description, // Backwards compatible
    description: adventure.description,
    adventure_short_description: adventure.shortDescription, // Backwards compatible
    short_description: adventure.shortDescription,
    adventure_image: adventure.image, // Backwards compatible
    image: adventure.image,
    tags: adventure.tags,
    adventure_public: adventure.public,
    adventure_public_requested: adventure.publicRequested,
    game_engine_version: adventure.agentVersion,
    gameEngineVersionAvailable: process.env.STEAMSHIP_AGENT_VERSION,
  };

  let unpublishedChanges = !objectEquals(
    adventure.agentDevConfig || {},
    adventure.agentConfig || {}
  );

  const isGenerating = adventure?.state == "generating";
  const generatingTaskId = adventure?.stateTaskId;

  console.log(`Generating state: ${isGenerating}, ${generatingTaskId}`);

  return (
    <Editor
      adventureId={adventure.id}
      devConfig={devConfig}
      hasUnpublishedChanges={unpublishedChanges}
      isUserApproved={userApproval?.isApproved || false}
      isGenerating={adventure?.state == "generating"}
      isGeneratingTaskId={adventure?.stateTaskId}
      stateUpdatedAt={adventure?.stateUpdatedAt}
    />
  );
}
