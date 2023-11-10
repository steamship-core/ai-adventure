export const dynamic = "force-dynamic";

import { DynamicBackgroundAudio } from "@/components/audio/dynamic-background-audio";
import RecoilProvider from "@/components/providers/recoil";
import Quest from "@/components/quest/quest";
import { getAgent } from "@/lib/agent/agent.server";
import { getOrCreateUserEnergy } from "@/lib/energy/energy.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function QuestPage({
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
    redirect("/adventures");
  }

  const gameState = await getGameState(agent?.agentUrl);

  if (gameState?.active_mode == "error") {
    const whatHappened = encodeURIComponent(
      "Your game has transitioned to an irrecoverable error state."
    );
    const whatYouCanDo = encodeURIComponent(
      "Try creating a new game. We're sorry this happened!"
    );
    const technicalDetails = encodeURIComponent(
      gameState?.unrecoverable_error || "Unknown"
    );
    redirect(
      `/error?whatHappened=${whatHappened}&whatYouCanDo=${whatYouCanDo}&technicalDetails=${technicalDetails}`
    );
  }

  let energyState = (await getOrCreateUserEnergy(userId))?.energy || 0;

  return (
    <RecoilProvider
      gameState={gameState}
      energyState={energyState}
      backgroundAudioOfferedState={true}
      audioActiveState={true}
    >
      <Quest
        workspaceHandle={agent.handle}
        gameEngineVersion={agent.agentVersion || "Unknown"}
        gameState={gameState}
        agentBaseUrl={agent.agentUrl}
        isDevelopment={agent.isDevelopment || false}
      />
      <DynamicBackgroundAudio />
    </RecoilProvider>
  );
}
