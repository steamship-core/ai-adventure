"use client";
import { PackageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { CharacterSheet } from "../camp/character-sheet";
import HeaderBackButton from "../header-back-button";
import InventorySheet from "../inventory-sheet";
import { recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

const BackgroundAudioToggle = dynamic(
  () => import("../audio/background-audio-toggle"),
  { ssr: false }
);

export const QuestHeader = ({
  isComplete,
  workspaceHandle = "",
  gameEngineVersion = "",
}: {
  isComplete: boolean;
  gameEngineVersion?: string;
  workspaceHandle?: string;
}) => {
  const gameState = useRecoilValue(recoilGameState);
  const { questId, handle } = useParams();

  const questArcs = gameState?.quest_arc || [];
  const questIndex = gameState?.quests?.findIndex((q) => q.name === questId);

  const questArc = questIndex > questArcs.length ? null : questArcs[questIndex];

  return (
    <header className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
      <div>
        <div>
          <HeaderBackButton />
        </div>
        <div className="flex items-center justify-center">
          <CharacterSheet
            mini={true}
            workspaceHandle={workspaceHandle}
            gameEngineVersion={gameEngineVersion || "unknown"}
          />
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
      </div>
      <div className="flex items-center justify-center">
        <BackgroundAudioToggle text="" /> &nbsp;
        <InventorySheet>
          <Button variant="outline" size="icon">
            <PackageIcon size={16} />
          </Button>
        </InventorySheet>
      </div>
    </header>
  );
};
