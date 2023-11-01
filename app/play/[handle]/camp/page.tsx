import { ActionBar } from "@/components/camp/action-bar";
import { CampImage } from "@/components/camp/camp-image";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { QuestProgress } from "@/components/camp/quest-progress";
import { SummaryStats } from "@/components/camp/summary-stats";
import { WelcomeModal } from "@/components/camp/welcome-modal";
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

export default async function CampPage({
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
    console.log("no agent- redirecting to character creation");
    redirect(`/adventures`);
  }

  let gameState = await getGameState(agent?.agentUrl);
  let energyState = (await getOrCreateUserEnergy(userId))?.energy || 0;

  let refreshGameState = false;

  if (gameState?.active_mode == "onboarding") {
    console.log(JSON.stringify(gameState));
    console.log("onboarding- redirecting to character creation");
    redirect(`/play/${params.handle}/character-creation`);
  }

  if (!gameState?.quest_arc || gameState?.quest_arc?.length === 0) {
    await generateQuestArc(agent?.agentUrl);
    refreshGameState = true;
  }

  if (refreshGameState) {
    gameState = await getGameState(agent?.agentUrl);
  }

  return (
    <RecoilProvider
      gameState={gameState}
      energyState={energyState}
      backgroundAudioState={false}
      backgroundAudioUrlState={"/music.wav"}
    >
      <WelcomeModal />

      <main className="w-full h-full">
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
          <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
            {agent.isDevelopment && <PlayTestBanner />}
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet />
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
      </main>
    </RecoilProvider>
  );
}
