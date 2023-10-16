import { ActionBar } from "@/components/camp/action-bar";
import { CampMembers } from "@/components/camp/camp-members";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { SummaryStats } from "@/components/camp/summary-stats";
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
    <RecoilProvider gameState={gameState}>
      <main className="h-[100dvh] w-full">
        <div className="h-full flex flex-col justify-between max-w-4xl mx-auto p-6 gap-6">
          <div className="flex flex-col gap-6 h-[80%]">
            <div className="flex justify-between items-center">
              <div>
                <CharacterSheet />
              </div>
              <SummaryStats />
            </div>
            <div className="">
              <div className="relative rounded-lg overflow-hidden w-full aspect-video">
                <Image
                  fill
                  sizes="100vw"
                  src={randomlyGetBackground()}
                  alt="background"
                  className="object-cover -z-10"
                />
              </div>
            </div>
            <div className="overflow-scroll flex flex-grow flex-col">
              <CampMembers />
            </div>
          </div>
          <div>
            <ActionBar />
          </div>
        </div>
      </main>
    </RecoilProvider>
  );
}
