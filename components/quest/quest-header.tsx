"use client";
import { ArrowLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import AudioSheet from "../audio-sheet";
import { CharacterSheet } from "../camp/character-sheet";
import InventorySheet from "../inventory-sheet";
import { recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const QuestHeader = ({ isComplete }: { isComplete: boolean }) => {
  const gameState = useRecoilValue(recoilGameState);
  const { questId } = useParams();

  const questArcs = gameState?.quest_arc || [];
  const questIndex = gameState?.quests?.findIndex((q) => q.name === questId);

  const questArc = questIndex > questArcs.length ? null : questArcs[questIndex];

  return (
    <header className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
      <div className="flex items-center justify-center">
        {!isComplete ? (
          <Button asChild variant="link" className="pl-0">
            <Link href="/play/camp">
              <ArrowLeftIcon size={16} />
            </Link>
          </Button>
        ) : (
          <span />
        )}
        <CharacterSheet mini={true} />
        {questArc && (
          <div className="ml-2 mr-2 flex flex-col">
            <TypographySmall className="text-xs">
              {questArc.location}
            </TypographySmall>
            <TypographyMuted className="text-xs">
              {questArc.goal}
            </TypographyMuted>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <AudioSheet text="" /> &nbsp;
        <InventorySheet>
          <Button variant="outline" size="icon">
            <PackageIcon size={16} />
          </Button>
        </InventorySheet>
      </div>
    </header>
  );
};
