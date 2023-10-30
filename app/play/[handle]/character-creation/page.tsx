import CharacterCreation from "@/components/character-creation";
import { createAgent } from "@/lib/agent/agent.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";

export default async function CharacterCreationPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  await createAgent(userId, params.adventureId);
  return <CharacterCreation />;
}
