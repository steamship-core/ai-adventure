import InventorySheet from "@/components/inventory-sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import prisma from "@/lib/db";
import { UserButton, auth } from "@clerk/nextjs";
import {
  ActivityIcon,
  BadgeDollarSignIcon,
  CompassIcon,
  FootprintsIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, useState } from "react";
import InteractionSheet, { CampMember } from "@/components/interaction-sheet";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getGameState, saveGameState } from "@/lib/game/game-state";
import StartAdventureButton from "@/components/camp/start-adventure-button";
import LoadingScreen from "@/components/loading/use-loading-screen";
import useLoadingScreen from "@/components/loading/use-loading-screen";

const ContentBox = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="bg-background/80 px-4 py-2 rounded-sm">{children}</div>
  </div>
);

const campMembers: CampMember[] = [
  {
    name: "The Merchant",
    image: "/merchant.png",
    id: "the-merchant",
    description:
      "A merchant who sells items. He heard of your adventures and offers to sell you some items or buy those you don't need.",
    inventory: [
      {
        id: "1",
        name: "Mysterious Orb",
        image: "/orb.png",
        description: "A mysterious orb. It glows with a strange energy.",
      },
      {
        id: "2",
        name: "Mysterious Orb",
        image: "/orb.png",
        description: "A mysterious orb. It glows with a strange energy.",
      },
      {
        id: "3",
        name: "Mysterious Orb",
        image: "/orb.png",
        description: "A mysterious orb. It glows with a strange energy.",
      },
      {
        id: "4",
        name: "Mysterious Orb",
        image: "/orb.png",
        description: "A mysterious orb. It glows with a strange energy.",
      },
    ],
    actionTitle: "Finalize Trade",
    actionDescription: "Confirm the exchange of goods",
  },
];

const bgImages = [
  "/campfire-dark.png",
  "/campfire.png",
  "/campfire-pixel.png",
  "/campfire-art.png",
];

export default async function CampPage() {
  const { userId } = auth();
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    redirect("/play/character-creation");
  }

  const randomlyGetBackground = () => {
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    return bgImages[randomIndex];
  };

  return (
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
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex gap-4 items-start text-left h-full">
                      <div className="flex items-center justify-center h-full">
                        <div className="rounded-full overflow-hidden h-8 w-8 md:h-18 md:w-18 border border-yellow-600 shadow-sm shadow-primary">
                          <Image
                            src={"/orc.png"}
                            height={1024}
                            width={1024}
                            alt="Character"
                          />
                        </div>
                      </div>
                      <div className="w-28 sm:w-44 lg:w-56">
                        <TypographyLarge>Sir Orc</TypographyLarge>
                        <Progress
                          value={33}
                          className="h-2 border border-foreground/20"
                        />
                        <TypographyMuted>Explorer</TypographyMuted>
                      </div>
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="w-100% h-[100dvh] flex flex-col pb-0 overflow-scroll"
                  >
                    <div className="flex items-center justify-center flex-col gap-4">
                      <TypographyH1>Sir Orc</TypographyH1>
                      <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
                        <Image
                          src={"/orc.png"}
                          height={1024}
                          width={1024}
                          alt="Character"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <TypographyP className="flex items-center">
                          <ActivityIcon
                            size={20}
                            className="mr-2 text-indigo-400"
                          />
                          100/100
                        </TypographyP>
                        <TypographyP className="flex !mt-0 items-center">
                          <BadgeDollarSignIcon
                            size={20}
                            className="mr-2 text-yellow-400"
                          />
                          100
                        </TypographyP>
                      </div>
                      <TypographyH3>Explorer</TypographyH3>
                      <div className="w-full px-8">
                        <Progress
                          value={33}
                          className="h-2 border border-foreground/20"
                        />
                      </div>
                      <TypographyMuted>
                        4 adventures until next rank
                      </TypographyMuted>
                      <TypographyH3>Background</TypographyH3>
                      <TypographyMuted className="text-center">
                        You are a brave adventurer who has traveled far and wide
                        in search of treasure and glory. You have slain many
                        monsters, and saved many princesses. You are a hero.
                      </TypographyMuted>
                      <TypographyH3>Stats</TypographyH3>
                      <ul className="flex flex-col gap-2 list-disc">
                        <li>
                          <TypographyMuted>6 quests completed</TypographyMuted>
                        </li>
                        <li>
                          <TypographyMuted>9 items found</TypographyMuted>
                        </li>
                      </ul>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TypographySmall className="flex items-center">
                  <ActivityIcon size={16} className="mr-2 text-indigo-400" />
                  100/100
                </TypographySmall>
                <TypographySmall className="flex items-center">
                  <BadgeDollarSignIcon
                    size={16}
                    className="mr-2 text-yellow-400"
                  />
                  100
                </TypographySmall>
              </div>
            </div>
          </ContentBox>
          <ContentBox>
            <TypographyH3>Camp Members</TypographyH3>
            {campMembers.length > 0 && (
              <div className="mt-8 flex">
                {campMembers.map((member) => (
                  <InteractionSheet key={member.id} member={member} />
                ))}
              </div>
            )}
            {campMembers.length === 0 && (
              <div className="flex flex-col text-center items-center justify-center w-full h-full mt-4">
                <TypographyP>You have no camp members yet.</TypographyP>
                <TypographySmall>
                  Go on some more adventures and you might find some!
                </TypographySmall>
              </div>
            )}
          </ContentBox>
          <ContentBox>
            <div className="flex flex-col gap-2">
              <StartAdventureButton />
              <Button variant="outline">
                <FootprintsIcon className="mr-2" size={16} />
                Send on an adventure
              </Button>
              <InventorySheet />
            </div>
          </ContentBox>
        </div>
      </div>
    </main>
  );
}
