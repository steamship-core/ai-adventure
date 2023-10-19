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
    throw new Error("no user");
  }

  let agent = await getAgent(userId);

  if (!agent) {
    agent = await createAgent(userId);
    return <CharacterCreation />;
  } else {
    // We already have an agent. Need to check if we're still onboarding.
    let gameState = await getGameState(agent.agentUrl);
    if (gameState.active_mode == "onboarding") {
      return <CharacterCreation />;
    } else {
      redirect("/play/camp");
    }
  }
}
