import Quest from "@/components/quest/quest";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function QuestPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId);

  if (!agent) {
    redirect("/play/character-creation");
  }

  const gameState = await getGameState(agent?.agentUrl);
  return <Quest gameState={gameState} agentBaseUrl={agent.agentUrl} />;
}
