import CharacterCreation from "@/components/character-creation";
import { getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { getGameState } from "@/lib/game/game-state.server";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function CharacterCreationPage({
  params,
}: {
  params: { handle: string };
}) {
  const userId = getUserIdFromClerkOrAnon();

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
  }

  if (gameState.active_mode == "quest" && gameState.current_quest) {
    redirect(`/play/${agent.handle}/quest/${gameState.current_quest}`);
  }

  if (gameState.active_mode == "quest") {
    redirect(`/play/${agent.handle}/camp`);
  }
  return <CharacterCreation isDevelopment={agent.isDevelopment || false} />;
}
