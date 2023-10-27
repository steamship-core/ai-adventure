import ReturnToCampButton from "@/components/account/return-to-camp-button";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { SummaryStats } from "@/components/camp/summary-stats";
import RecoilProvider from "@/components/providers/recoil";
import SubscriptionSheet from "@/components/subscription-sheet";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function AccountPlanPage() {
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

  if (gameState?.active_mode == "onboarding") {
    redirect("/character-creation");
  }

  return (
    <RecoilProvider
      gameState={gameState}
      backgroundAudioState={false}
      backgroundAudioUrlState={"/music.wav"}
    >
      <main className="h-[100dvh] min-h-[600px] w-full">
        <div className="h-full flex flex-col justify-between max-w-xl mx-auto p-6 gap-2 overflow-auto">
          <div className="flex flex-col gap-2 h-[80%] overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet />
              </div>
              <SummaryStats />
            </div>{" "}
            <SubscriptionSheet />
          </div>
          <div id="actions">
            <div className="w-full">
              <div className="flex w-full  flex-col justify-center items-center gap-2">
                <div className="w-full">
                  <div className="flex w-full  flex-col justify-center items-center gap-2">
                    <ReturnToCampButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </RecoilProvider>
  );
}
