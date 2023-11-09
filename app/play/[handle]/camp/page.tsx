import { DynamicBackgroundAudio } from "@/components/audio/dynamic-background-audio";
import { ActionBar } from "@/components/camp/action-bar";
import { AudioChecker } from "@/components/camp/audio-checker";
import { CampImage } from "@/components/camp/camp-image";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { QuestProgress } from "@/components/camp/quest-progress";
import { SummaryStats } from "@/components/camp/summary-stats";
import { WelcomeModal } from "@/components/camp/welcome-modal";
import HeaderBackButton from "@/components/header-back-button";
import RecoilProvider from "@/components/providers/recoil";
import { PlayTestBanner } from "@/components/status-banners/play-test";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { getAgent } from "@/lib/agent/agent.server";
import { getOrCreateUserEnergy } from "@/lib/energy/energy.server";
import { getGameState } from "@/lib/game/game-state.server";
import { generateQuestArc } from "@/lib/game/quest.server";
import { auth } from "@clerk/nextjs";
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
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    errorRedirect(
      "Login required.",
      "Try logging in first.",
      "No user id found."
    );
    throw new Error("no user");
  }

  console.log("Got user", userId);
  const agent = await getAgent(userId, params.handle);
  console.log("Got agent", agent);

  if (!agent) {
    redirect(`/adventures`);
  }

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

  if (!gameState?.quest_arc || gameState?.quest_arc?.length === 0) {
    try {
      await generateQuestArc(agent?.agentUrl);
      refreshGameState = true;
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
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
          <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
            <div>
              <HeaderBackButton />
            </div>
            {agent.isDevelopment && <PlayTestBanner />}
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet
                  workspaceHandle={agent.handle}
                  gameEngineVersion={agent.agentVersion || "unknown"}
                />
              </div>
              <SummaryStats />
            </div>
            <div className="overflow-auto">
              <div id="quest-progress">
                <QuestProgress />
              </div>
              <div id="camp">
                <TypographyLarge className="mt-4 mb-2">Camp</TypographyLarge>
                <CampImage />
              </div>
            </div>
          </div>
          <div id="actions">
            <ActionBar />
          </div>
        </div>
        <AudioChecker />
        <DynamicBackgroundAudio />
      </main>
    </RecoilProvider>
  );
}
