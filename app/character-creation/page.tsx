import CharacterCreation from "@/components/character-creation";
import { createAgent, getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function CharacterCreationPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    console.log("No user");
    throw new Error("no user");
  }

  let agent = await getAgent(userId);

  if (!agent) {
    log.info("User does not yet have an agent.");
    console.log("User does not yet have an agent.");
    agent = await createAgent(userId);
    return <CharacterCreation />;
  }

  log.info(`User already has agent: ${agent}`);
  console.log("User already has an agent");

  // We already have an agent. Need to check if we're still onboarding.
  let gameState = await getGameState(agent.agentUrl);

  if (!gameState) {
    throw new Error("Agent returned an empty game state object.");
  }

  if ((gameState as any)?.status?.statue == "failed") {
    throw new Error(`Agent returned a failed game state: ${gameState}`);
  }

  if (gameState?.active_mode == "onboarding") {
    return <CharacterCreation />;
  }

  redirect("/play/camp");
}
