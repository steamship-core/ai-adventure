"use client";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { Progress } from "../ui/progress";
import { ActivityIcon, BadgeDollarSignIcon } from "lucide-react";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";

export const CharacterSheet = () => {
  const gameState = useRecoilValue(recoilGameState);

  return (
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
            <TypographyLarge>{gameState.player.name}</TypographyLarge>
            <Progress value={33} className="h-2 border border-foreground/20" />
            <TypographyMuted>{gameState.player.rank}</TypographyMuted>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0 overflow-scroll"
      >
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          <div className="flex items-center justify-center flex-col w-full gap-2">
            <TypographyH1>{gameState.player.name}</TypographyH1>
            <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
              <Image
                src={"/orc.png"}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <TypographyP className="flex items-center">
                <ActivityIcon size={20} className="mr-2 text-indigo-400" />
                100/100
              </TypographyP>
              <TypographyP className="flex !mt-0 items-center">
                <BadgeDollarSignIcon
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                {gameState.player.gold || 0}
              </TypographyP>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <TypographyH3>Explorer</TypographyH3>
              <div className="w-full">
                <Progress
                  value={33}
                  className="h-2 border border-foreground/20"
                />
              </div>
              <TypographyMuted>4 adventures until next rank</TypographyMuted>
            </div>
            <div>
              <TypographyH3>Background</TypographyH3>
              <TypographyMuted>{gameState.player.background}</TypographyMuted>
            </div>
            <div>
              <TypographyH3>Description</TypographyH3>
              <TypographyMuted>{gameState.player.description}</TypographyMuted>
            </div>
            <div>
              <TypographyH3>Motivation</TypographyH3>
              <TypographyMuted>{gameState.player.motivation}</TypographyMuted>
            </div>
            <div>
              <TypographyH3>Stats</TypographyH3>
              <ul className="flex flex-col gap-2 list-disc pl-6">
                <li>
                  <TypographyMuted>
                    {gameState.quests.length} quests completed
                  </TypographyMuted>
                </li>
                <li>
                  <TypographyMuted>
                    {gameState.player.inventory.length} items found
                  </TypographyMuted>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
