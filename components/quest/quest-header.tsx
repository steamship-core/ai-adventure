"use client";
import { useCurrentQuestArc } from "@/lib/hooks";
import { ArrowLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import AudioSheet from "../audio-sheet";
import { CharacterSheet } from "../camp/character-sheet";
import InventorySheet from "../inventory-sheet";
import { Button } from "../ui/button";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const QuestHeader = ({ isComplete }: { isComplete: boolean }) => {
  const questArc = useCurrentQuestArc();

  return (
    <div className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
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
          <div className="ml-2 mr-12">
            <TypographySmall>{questArc.location}</TypographySmall>
            <TypographyMuted>{questArc.goal}</TypographyMuted>
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
    </div>
  );
};
