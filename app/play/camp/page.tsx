import InventorySheet from "@/components/inventory-sheet";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
import { FootprintsIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getGameState, saveGameState } from "@/lib/game/game-state.server";
import StartAdventureButton from "@/components/camp/start-adventure-button";
import RecoilProvider from "@/components/recoil-provider";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { SummaryStats } from "@/components/camp/summary-stats";
import { CampMembers } from "@/components/camp/camp-members";
import { ContentBox } from "@/components/camp/content-box";
import { completeOnboarding } from "@/lib/game/onboarding";
import { getAgent } from "@/lib/agent/agent.server";
import { log } from "next-axiom";

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
  console.log(gameState);

  return (
    <RecoilProvider gameState={gameState}>
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
    </RecoilProvider>
  );
}
