export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { getGameState } from "@/lib/game/game-state.server";
import { startQuest } from "@/lib/game/quest.server";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function QuestPage({
  params,
}: {
  params: { handle: string; questId: string };
}) {
  const userId = getUserIdFromClerkOrAnon();

  const agent = await getAgent(userId, params.handle);
  if (!agent) {
    redirect("/adventures");
  }

  const gameState = await getGameState(agent?.agentUrl);
  // If the game state says we're currently in a quest, then we should re-direct ot that quest.
  if (gameState?.active_mode === "quest" && gameState?.current_quest) {
    log.debug(`Activating existing quest: ${gameState?.current_quest}`);
    redirect(`/play/${params.handle}/quest/${gameState?.current_quest}`);
  }

  const quest = await startQuest(userId, agent!.agentUrl);
  redirect(`/play/${params.handle}/quest/${quest.name}`);
}
