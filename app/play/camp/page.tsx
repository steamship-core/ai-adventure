import InventorySheet from "@/components/inventory-sheet";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
import { FootprintsIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getGameState } from "@/lib/game/game-state";
import StartAdventureButton from "@/components/camp/start-adventure-button";
import RecoilProvider from "@/components/recoil-provider";
import { CharacterSheet } from "@/components/camp/character-sheet";
import { SummaryStats } from "@/components/camp/summary-stats";
import { CampMembers } from "@/components/camp/camp-members";
import { ContentBox } from "@/components/camp/content-box";

const bgImages = [
  "/campfire-dark.png",
  "/campfire.png",
  "/campfire-pixel.png",
  "/campfire-art.png",
];

export default async function CampPage() {
  const { userId } = auth();
  console.log(userId);
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    redirect("/play/character-creation");
  }

  const gameState = await getGameState(agent?.agentUrl);

  const randomlyGetBackground = () => {
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    return bgImages[randomIndex];
  };

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
          <div className="w-full flex items-center justify-end pt-6 pb-2 gap-3 max-w-5xl mx-auto">
            <Button variant="link" size="sm" asChild>
              <Link
                target="_blank"
                href="https://github.com/steamship-core/ai-adventure"
              >
                <StarIcon className="w-4 h-4 mr-2" /> Star
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex flex-col flex-grow justify-between max-w-5xl w-full mx-auto">
            <ContentBox>
              <div className="flex justify-between">
                <div>
                  <CharacterSheet />
                </div>
                <SummaryStats />
              </div>
            </ContentBox>
            <CampMembers />
            <ContentBox>
              <div className="flex flex-col gap-2">
                <StartAdventureButton />
                <Button variant="outline">
                  <FootprintsIcon className="mr-2" size={16} />
                  Send on an adventure
                </Button>
                <InventorySheet gameState={gameState} />
              </div>
            </ContentBox>
          </div>
        </div>
      </main>
    </RecoilProvider>
  );
}
