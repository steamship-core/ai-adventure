import { createAdventure } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

const CreateTemplatePage = async () => {
  const { userId, user } = auth();

  if (!userId) {
    log.error("No user");
    return redirect("/adventures/create?error=not-logged-in");
  }

  const name = "Epic Quest";
  const description = "An amazing journey with pixel art";
  const adventure = await createAdventure({
    creatorId: userId,
    createdBy: user?.username || user?.firstName || "Unknown",
    name,
    description,
    agentVersion: process.env.STEAMSHIP_AGENT_VERSION!,
  });

  if (!adventure) {
    log.error("No adventure");
    return redirect("/adventures/create?error=could-not-create-adventure");
  }
  redirect(`/adventures/editor/${adventure.id}`);
};

export default CreateTemplatePage;
