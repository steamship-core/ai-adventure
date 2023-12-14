import { DynamicBackgroundAudio } from "@/components/audio/dynamic-background-audio";
import { AudioChecker } from "@/components/camp/audio-checker";
import { QuestProgress } from "@/components/camp/quest-progress";
import { WelcomeModal } from "@/components/camp/welcome-modal";
import { InGameNavigation } from "@/components/navigation/in-game-navigation";
import RecoilProvider from "@/components/providers/recoil";
import { getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { getOrCreateUserEnergy } from "@/lib/energy/energy.server";
import { getGameState } from "@/lib/game/game-state.server";
import { generateQuestArc, startQuest } from "@/lib/game/quest.server";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

function errorRedirect(what: string, cando: string, deets: string) {
  const whatHappened = encodeURIComponent(what);
  const whatYouCanDo = encodeURIComponent(cando);
  const technicalDetails = encodeURIComponent(deets);
  redirect(
    `/error?whatHappened=${whatHappened}&whatYouCanDo=${whatYouCanDo}&technicalDetails=${technicalDetails}`
  );
}

export default async function CampPage({
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
    redirect(`/adventures`);
  }

  const adventureGoal = (agent?.Adventure?.agentConfig as unknown as any)
    ?.adventure_goal;

  let gameState = await getGameState(agent?.agentUrl);

  let energyState = (await getOrCreateUserEnergy(userId))?.energy || 0;

  let refreshGameState = false;

  if (gameState?.active_mode == "error") {
    errorRedirect(
      "Your game has transitioned to an irrecoverable error state.",
      "Try creating a new game. We're sorry this happened!",
      gameState?.unrecoverable_error || "Unknown"
    );
  }

  if (gameState?.active_mode == "onboarding") {
    redirect(`/play/${params.handle}/character-creation`);
  }

  // NOTE: This used to async wait on this generation, but that resulted in huge errors
  // when OpenAI went down. Now we're not waiting and will repeatedly check from the
  // rendered page.
  if (!gameState?.quest_arc || gameState?.quest_arc?.length === 0) {
    try {
      generateQuestArc(agent?.agentUrl);
      // refreshGameState = true;
    } catch {
      errorRedirect(
        "There was an error attempting to generate the quest arc for your game. This usually means that OpenAI is having service issues.",
        "Try creating a new game. We're sorry this happened!",
        gameState?.unrecoverable_error || "Unknown"
      );
    }
  }

  if (refreshGameState) {
    try {
      gameState = await getGameState(agent?.agentUrl);
    } catch {
      errorRedirect(
        "There was an error fetching your game state.",
        "Try creating a new game. We're sorry this happened!",
        gameState?.unrecoverable_error || "Unknown"
      );
    }
  }

  const onStartQuest = async () => {
    "use server";
    // If the game state says we're currently in a quest, then we should re-direct ot that quest.
    if (gameState?.active_mode === "quest" && gameState?.current_quest) {
      log.debug(`Activating existing quest: ${gameState?.current_quest}`);
      return gameState?.current_quest;
    }

    const quest = await startQuest(userId, agent!.agentUrl);
    return quest.name!;
  };

  return (
    <RecoilProvider
      gameState={gameState}
      energyState={energyState}
      backgroundAudioOfferedState={true}
      audioActiveState={true}
      backgroundAudioUrlState={undefined}
    >
      <WelcomeModal />

      <main className="w-full h-full">
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-2 md:p-6 gap-2 overflow-hidden">
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <InGameNavigation
              isDevelopment={agent.isDevelopment === true}
              workspaceHandle={agent.handle}
              gameEngineVersion={agent.agentVersion || "unknown"}
              showInventory={false}
            />
            <QuestProgress
              adventureGoal={adventureGoal}
              adventure={agent.Adventure}
              onStartQuest={onStartQuest}
            />
          </div>
        </div>
        <AudioChecker />
        <DynamicBackgroundAudio />
      </main>
    </RecoilProvider>
  );
}
