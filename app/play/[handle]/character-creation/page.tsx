import CharacterCreation from "@/components/character-creation";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function CharacterCreationPage({
  params,
}: {
  params: { handle: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    log.error("No agent");
    redirect(`/adventures`);
  }

  const gameState = await getGameState(agent.agentUrl);

  if (gameState.active_mode == "camp") {
    redirect(`/play/${agent.handle}/camp`);
    return;
  }

  if (gameState.active_mode == "quest" && gameState.current_quest) {
    redirect(`/play/${agent.handle}/quest/${gameState.current_quest}`);
    return;
  }

  if (gameState.active_mode == "quest") {
    redirect(`/play/${agent.handle}/camp`);
    return;
  }

  return <CharacterCreation isDevelopment={agent.isDevelopment || false} />;
}
