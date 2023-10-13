import CharacterCreation from "@/components/character-creation";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createAgent, getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { log } from "next-axiom";

export default async function CharacterCreationPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  let agent = await getAgent(userId);

  if (!agent) {
    agent = await createAgent(userId!);
    return <CharacterCreation />;
  } else {
    // We already have an agent. Need to check if we're still onboarding.
    let gameState = getGameState(agent.agentUrl);
    if ((await gameState).active_mode == "onboarding") {
      return <CharacterCreation />;
    } else {
      redirect("/play/camp");
    }
  }
}
