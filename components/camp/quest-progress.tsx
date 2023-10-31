"use client";

import { getGameState } from "@/lib/game/game-state.client";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilGameState } from "../providers/recoil";
import { Skeleton } from "../ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

const QuestProgressElement = ({
  totalQuests,
  questArc,
  isIncompleteQuest,
  isCompleteQuest,
  isCurrentquest,
  index,
  isClamped,
  setIsClamped,
}: {
  totalQuests: number;
  questArc: { location: string; goal: string };
  isIncompleteQuest: boolean;
  isCompleteQuest: boolean;
  isCurrentquest: boolean;
  index: number;
  isClamped: boolean;
  setIsClamped: Dispatch<SetStateAction<boolean>>;
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
      <button
        onClick={() => setIsClamped((clamped) => !clamped)}
        className="mt-2 flex flex-col text-left"
      >
        <TypographySmall
          className={cn("leading-1", isClamped && "line-clamp-2")}
        >
          {questArc.location}
        </TypographySmall>
        <TypographyMuted
          className={cn(
            isCompleteQuest && "text-green-800",
            isCurrentquest && "text-blue-400/70",
            isClamped && "line-clamp-2"
          )}
        >
          {questArc.goal}
        </TypographyMuted>
      </button>
    </div>
  );
};

export const QuestProgress = () => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const [isClamped, setIsClamped] = useState(true);
  const [isArcClamped, setIsArcClamped] = useState(true);
  const params = useParams<{ handle: string }>();

  useEffect(() => {
    const refetchInterval = setInterval(async () => {
      if (!gameState?.quest_arc || gameState?.quest_arc?.length === 0) {
        const gameState = await getGameState(params.handle);
        if (gameState) {
          setGameState(gameState);
        }
      } else {
        clearInterval(refetchInterval);
      }
    }, 3000);

    return () => {
      clearInterval(refetchInterval);
    };
  }, [gameState?.quest_arc, setGameState]);

  const questArc = gameState?.quest_arc || [];
  const questCount = gameState?.current_quest
    ? gameState?.quests?.length - 1
    : gameState?.quests?.length;

  return (
    <>
      <TypographyLarge className="">Quest Progress</TypographyLarge>
      <button
        onClick={() => setIsClamped((clamped) => !clamped)}
        className="text-left"
      >
        <TypographyMuted className={cn(isClamped && "line-clamp-2")}>
          {gameState?.player?.motivation}
        </TypographyMuted>
      </button>
      <div className="flex items-center justify-center">
        {questArc.length === 0 && (
          <Skeleton className="w-full h-24 mt-2 flex items-center justify-center text-sm">
            Generating quest arc
          </Skeleton>
        )}
      </div>
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
              key={i}
              setIsClamped={setIsArcClamped}
              isClamped={isArcClamped}
            />
          );
        })}
      </div>
    </>
  );
};
