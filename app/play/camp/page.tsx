import { BackgroundAudio } from "@/components/audio-provider";
import { ActionBar } from "@/components/camp/action-bar";
import { CampImage } from "@/components/camp/camp-image";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { QuestProgress } from "@/components/camp/quest-progress";
import { SummaryStats } from "@/components/camp/summary-stats";
import { WelcomeModal } from "@/components/camp/welcome-modal";
import RecoilProvider from "@/components/providers/recoil";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { updateInventory } from "@/lib/game/merchant.server";
import { generateQuestArc } from "@/lib/game/quest.server";
import { auth } from "@clerk/nextjs";
import { differenceInHours } from "date-fns";
import { log } from "next-axiom";
import { redirect } from "next/navigation";
export default async function CampPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId);

  if (!agent) {
    redirect("/character-creation");
  }

  let gameState = await getGameState(agent?.agentUrl);

  if (gameState.active_mode == "onboarding") {
    redirect("/character-creation");
  }

  if (!gameState.quest_arc) {
    await generateQuestArc(agent?.agentUrl);
    gameState = await getGameState(agent?.agentUrl);
  }

  // Update the merchants inventory
  const merchant = gameState?.camp?.npcs?.find(
    (npc) => npc.name == "The Merchant"
  );
  if (merchant) {
    const lastUpdatedAt = merchant.inventory_last_updated;
    if (
      !lastUpdatedAt ||
      differenceInHours(Date.now(), new Date(lastUpdatedAt)) > 12
    ) {
      // No need to wait for this. It will update in the background and the user will see the updated inventory on the next page load
      updateInventory(agent?.agentUrl, "The Merchant");
    }
  }
  return (
    <RecoilProvider
      gameState={gameState}
      backgroundAudioState={false}
      backgroundAudioUrlState={"/music.wav"}
    >
      <WelcomeModal />

      <main className="w-full h-full">
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
          <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet />
              </div>
              <SummaryStats />
            </div>
            <div className="overflow-auto">
              <div>
                <QuestProgress />
              </div>
              <div id="camp">
                <TypographyLarge className="mt-4">Camp</TypographyLarge>
                <TypographyMuted>
                  Click on the image to view camp members
                </TypographyMuted>
                <CampImage />
              </div>
            </div>
          </div>
          <div id="actions">
            <ActionBar />
          </div>
        </div>
      </main>
      <BackgroundAudio />
    </RecoilProvider>
  );
}
