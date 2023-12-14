"use client";

import { amplitude } from "@/lib/amplitude";
import { getGameState } from "@/lib/game/game-state.client";
import { cn } from "@/lib/utils";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Adventure } from "@prisma/client";

import {
  CheckIcon,
  FlameIcon,
  Loader2,
  LockIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";
import { log } from "next-axiom";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import InventorySheet from "../inventory-sheet";
import { recoilEnergyState, recoilGameState } from "../providers/recoil";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { CampImage } from "./camp-image";

function ConditionalLockIcon({ disabledQuest }: { disabledQuest: boolean }) {
  if (disabledQuest) {
    return <LockIcon size={16} className="h-3 w-3" />;
  }
  return null;
}

function ConditionalSparklesIcon({
  isCurrentquest,
}: {
  isCurrentquest: boolean;
}) {
  if (isCurrentquest) {
    return <SparklesIcon className="text-black h-4 w-4" />;
  }
  return null;
}

function ConditionalCheckIcon({
  isCompleteQuest,
}: {
  isCompleteQuest: boolean;
}) {
  if (isCompleteQuest) {
    return <CheckIcon className="text-black h-4 w-4" />;
  }
  return null;
}

const QuestProgressElement = ({
  questArc,
  isIncompleteQuest,
  isCompleteQuest,
  isCurrentquest,
  setLowEnergyModalOpen,
  index,
  totalQuests,
  adventure,
  questId,
  onStartQuest,
}: {
  totalQuests: number;
  questArc: { location: string; goal: string; description?: string };
  isIncompleteQuest: boolean;
  isCompleteQuest: boolean;
  isCurrentquest: boolean;
  index: number;
  isClamped: boolean;
  setIsClamped: Dispatch<SetStateAction<boolean>>;
  setLowEnergyModalOpen: Dispatch<SetStateAction<boolean>>;
  adventure?: Adventure | null;
  questId?: string;
  onStartQuest: () => Promise<string>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const gameState = useRecoilValue(recoilGameState);
  const params = useParams();
  const isInQuest = gameState?.active_mode === "quest";
  const energy = useRecoilValue(recoilEnergyState);
  const [isLoading, setIsLoading] = useState(false);
  const clerk = useClerk();
  const { userId } = useAuth();

  useEffect(() => {
    if (isCurrentquest) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, []);

  const onClick = async () => {
    // ANON AUTH: If this is > Quest 1 then we need to make sure the user is logged in.
    if (index > 0) {
      if (!userId) {
        clerk.openSignIn({
          redirectUrl: document.location.href,
        });
        return;
      }
    }

    const lowEnergy = (energy || 0) < 10;
    setIsLoading(true);
    if (lowEnergy) {
      setLowEnergyModalOpen(true);
      return;
    }

    // If the game state says we're currently in a quest, then we should re-direct ot that quest.
    if (gameState?.active_mode === "quest" && gameState?.current_quest) {
      log.debug(`Activating existing quest: ${gameState?.current_quest}`);
      amplitude.track("Button Click", {
        buttonName: "Go on an Adventure",
        location: "Camp",
        action: "continue-quest",
        adventureId: adventure?.id,
        workspaceHandle: params.handle,
        questId: gameState?.current_quest,
      });
    } else {
      log.debug(`Activating existing quest: ${gameState?.current_quest}`);
      amplitude.track("Button Click", {
        buttonName: "Go on an Adventure",
        location: "Camp",
        action: "start-quest",
        adventureId: adventure?.id,
        workspaceHandle: params.handle,
        questId: gameState?.current_quest,
      });
    }
    const nextQuestId = await onStartQuest();
    // Intentionally not using the router here because we want to force a reload.
    window.location.href = `/play/${params.handle}/quest/${nextQuestId}`;
  };

  const disabledQuest = isIncompleteQuest && !isCurrentquest;
  return (
    <div className="relative w-full pl-12 py-2">
      <div className="absolute left-0 w-12 h-full pr-[1.65rem] pl-[1.05rem]">
        <div
          className={cn(
            "w-full h-full relative",
            disabledQuest && "bg-muted",
            isCompleteQuest && "bg-indigo-200",
            isCurrentquest &&
              "bg-gradient-to-b from-indigo-200 via-orange-200 to-muted",
            index === 0 && "rounded-t-lg",
            index === totalQuests - 1 && "rounded-b-lg"
          )}
        >
          <div className="absolute h-full w-full top-0 left-0">
            <div className="w-full h-full flex items-center justify-center">
              <div
                className={cn(
                  "rounded-full w-6 h-6 absolute",
                  disabledQuest && "bg-muted",
                  isCompleteQuest && "bg-indigo-200",
                  isCurrentquest && "bg-white"
                )}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ConditionalCheckIcon isCompleteQuest={isCompleteQuest} />
                  <ConditionalSparklesIcon isCurrentquest={isCurrentquest} />
                  <ConditionalLockIcon disabledQuest={disabledQuest} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card
        className={cn(
          "relative",
          disabledQuest && "opacity-50",
          isCurrentquest && "border-indigo-200"
        )}
        ref={ref}
      >
        {isCompleteQuest && (
          <Badge
            variant="outline"
            className="absolute right-4 top-4 border-indigo-400"
          >
            Completed
          </Badge>
        )}
        <CardHeader>
          <div>
            <CardTitle className="flex gap-2">
              <MapPinIcon />
              {questArc.location}
            </CardTitle>
          </div>
          {questArc.goal && (
            <TypographyMuted className="flex mt-4">
              <b className="mr-2">Goal:</b>
              {questArc.goal}
            </TypographyMuted>
          )}
        </CardHeader>
        <CardFooter>
          {isCurrentquest && (
            <Button
              onClick={onClick}
              className="bg-indigo-600 text-white hover:bg-indigo-800"
              disabled={isLoading}
            >
              <SparklesIcon className="mr-2" />
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <> {isInQuest ? "Continue Quest" : "Start Quest"}</>
              )}
            </Button>
          )}
          {disabledQuest && (
            <Button variant="outline" disabled>
              Start Quest
            </Button>
          )}
          {isCompleteQuest && (
            <Button variant="outline" disabled={isLoading}>
              {/* Intentionally not using Link here because we want to force a reoload*/}
              <a href={`/play/${params.handle}/quest/${questId}`}>View Quest</a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export const QuestProgress = ({
  adventureGoal,
  adventure,
  onStartQuest,
}: {
  adventureGoal?: string;
  adventure?: Adventure | null;
  onStartQuest: () => Promise<string>;
}) => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const [isClamped, setIsClamped] = useState(true);
  const [isArcClamped, setIsArcClamped] = useState(true);
  const params = useParams<{ handle: string }>();
  const [lowEnergyModalOpen, setLowEnergyModalOpen] = useState(false);

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
      <div className="flex gap-4 justify-between">
        <div className="">
          <TypographyLarge className="">
            {adventure?.name || "Quest Progress"}{" "}
          </TypographyLarge>
          {adventureGoal && (
            <button
              onClick={() => setIsClamped((clamped) => !clamped)}
              className="text-left"
            >
              <TypographyMuted className={cn(isClamped && "line-clamp-2")}>
                {adventureGoal}
              </TypographyMuted>
            </button>
          )}
        </div>
        <InventorySheet
          onClick={() => {
            amplitude.track("Button Click", {
              buttonName: "View Inventory",
              location: "Camp",
              action: "view-inventory",
            });
          }}
        />
      </div>
      <CampImage />
      <div className="flex items-center justify-center">
        {questArc.length === 0 && (
          <Skeleton className="w-full h-24 mt-2 flex items-center justify-center text-sm">
            Generating quest arc
          </Skeleton>
        )}
      </div>
      <div
        id="quest-list"
        className="flex flex-col h-full overflow-scroll mt-2"
      >
        {questArc.map((quest, i) => {
          const isCurrentquest = questCount === i;
          const isIncompleteQuest = questCount < i + 1;
          const isCompleteQuest = !isCurrentquest && !isIncompleteQuest;
          const questId = gameState?.quests?.[i]?.name;
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
              setLowEnergyModalOpen={setLowEnergyModalOpen}
              adventure={adventure}
              questId={questId}
              onStartQuest={onStartQuest}
            />
          );
        })}
      </div>
      <Dialog
        open={lowEnergyModalOpen}
        onOpenChange={(o) => setLowEnergyModalOpen(o)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              Out of Energy!
            </DialogTitle>
            <DialogDescription>
              You&apos;ve ran out of energy. You can either wait for your energy
              to recharge, or you can purchase more energy.
            </DialogDescription>
          </DialogHeader>
          <Button
            asChild
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Link href="/account/plan">
              Purchase Energy <FlameIcon className="ml-2" />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
