import { AudioProvider } from "@/components/audio-provider";
import { CampMembers } from "@/components/camp/camp-members";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { ContentBox } from "@/components/camp/content-box";
import StartAdventureButton from "@/components/camp/start-adventure-button";
import { SummaryStats } from "@/components/camp/summary-stats";
import InventorySheet from "@/components/inventory-sheet";
import RecoilProvider from "@/components/recoil-provider";
import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import Image from "next/image";
import { redirect } from "next/navigation";

const bgImages = [
  "/campfire-dark.png",
  "/campfire.png",
  "/campfire-pixel.png",
  "/campfire-art.png",
];

export default async function CampPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  console.log(userId);
  const agent = await getAgent(userId);

  if (!agent) {
    redirect("/play/character-creation");
  }

  let gameState = await getGameState(agent?.agentUrl);
  if (gameState.active_mode == "onboarding") {
    redirect("/play/character-creation");
  }

  const randomlyGetBackground = () => {
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    return bgImages[randomIndex];
  };

  return (
    <RecoilProvider
      gameState={gameState}
      narrationAudioState={false}
      backgroundAudioState={false}
    >
      <AudioProvider>
        <main className="h-[100dvh] p-2 md:p-6 pt-0 relative">
          <Image
            fill
            sizes="100vw"
            src={randomlyGetBackground()}
            alt="background"
            className="object-cover -z-10"
          />
          <div className="h-full flex flex-col">
            <div className="flex flex-col flex-grow justify-between max-w-5xl w-full mx-auto">
              <ContentBox>
                <div className="flex justify-between">
                  <div>
                    <CharacterSheet />
                  </div>
                  <SummaryStats />
                </div>
                <div className="mt-4">
                  <CampMembers />
                </div>
              </ContentBox>
              <ContentBox>
                <div className="flex flex-col gap-2">
                  <StartAdventureButton />
                  <InventorySheet gameState={gameState} />
                </div>
              </ContentBox>
            </div>
          </div>
        </main>
      </AudioProvider>
    </RecoilProvider>
  );
}
