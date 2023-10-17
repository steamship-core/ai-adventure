"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

const QuestProgressElement = ({
  totalQuests,
  questArc,
  isIncompleteQuest,
  isCompleteQuest,
  isCurrentquest,
  index,
}: {
  totalQuests: number;
  questArc: { location: string; goal: string };
  isIncompleteQuest: boolean;
  isCompleteQuest: boolean;
  isCurrentquest: boolean;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentquest) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col min-w-[200px]",
        isCurrentquest ? "opacity-100" : isIncompleteQuest && "opacity-50",
        isCompleteQuest && "text-green-600",
        isCurrentquest && "text-blue-400"
      )}
    >
      <div className="flex mt-2 items-center">
        {!isCompleteQuest ? (
          <CircleIcon size={16} />
        ) : (
          <CheckCircle2Icon size={16} />
        )}
        {index !== totalQuests - 1 && (
          <div
            className={cn(
              "flex-1 border-t-2 border-foreground/70 ml-4",
              isCompleteQuest && "border-green-600/70",
              isCurrentquest && "border-blue-400/70"
            )}
          />
        )}
      </div>
      <div className="mt-2">
        <TypographySmall>{questArc.location}</TypographySmall>
        <TypographyMuted
          className={cn(
            isCompleteQuest && "text-green-800",
            isCurrentquest && "text-blue-400/70"
          )}
        >
          {questArc.goal}
        </TypographyMuted>
      </div>
    </div>
  );
};

export const QuestProgress = () => {
  const gameState = useRecoilValue(recoilGameState);
  const questArc = gameState?.quest_arc || [];
  const questCount = gameState.current_quest
    ? gameState.quests.length - 1
    : gameState.quests.length;
  console.log(gameState);
  // A horiztonally scrolling list of the players quest arc.
  // Each quest is represented by a card with the quest name and a progress bar.
  return (
    <div className="flex flex-row gap-4 overflow-x-auto mt-2">
      {questArc.map((quest, i) => {
        const isCurrentquest = questCount === i;
        const isIncompleteQuest = questCount < i + 1;
        const isCompleteQuest = !isCurrentquest && !isIncompleteQuest;
        return (
          <QuestProgressElement
            totalQuests={questArc.length}
            questArc={quest}
            isIncompleteQuest={isIncompleteQuest}
            isCompleteQuest={isCompleteQuest}
            isCurrentquest={isCurrentquest}
            index={i}
          />
        );
      })}
    </div>
  );
};
