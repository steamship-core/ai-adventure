"use client";

import { amplitude } from "@/lib/amplitude";
import { getGameState } from "@/lib/game/game-state.client";
import { Quest } from "@/lib/game/schema/quest";
import { cn } from "@/lib/utils";
import { Adventure } from "@prisma/client";
import {
  CheckIcon,
  FlameIcon,
  LockIcon,
  PackageIcon,
  SparklesIcon,
} from "lucide-react";
import { log } from "next-axiom";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import InventorySheet from "../inventory-sheet";
import useLoadingScreen from "../loading/use-loading-screen";
import { recoilEnergyState, recoilGameState } from "../providers/recoil";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

const QuestProgressElement = ({
  questArc,
  isIncompleteQuest,
  isCompleteQuest,
  isCurrentquest,
  setLowEnergyModalOpen,
  setIsVisible,
}: {
  totalQuests: number;
  questArc: { location: string; goal: string };
  isIncompleteQuest: boolean;
  isCompleteQuest: boolean;
  isCurrentquest: boolean;
  index: number;
  isClamped: boolean;
  setIsClamped: Dispatch<SetStateAction<boolean>>;
  setLowEnergyModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const gameState = useRecoilValue(recoilGameState);
  const params = useParams();
  const isInQuest = gameState?.active_mode === "quest";
  const energy = useRecoilValue(recoilEnergyState);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    const lowEnergy = (energy || 0) < 10;
    if (lowEnergy) {
      setLowEnergyModalOpen(true);
      return;
    }

    setIsVisible(true);
    setIsLoading(true);
    amplitude.track("Button Click", {
      buttonName: "Go on an Adventure",
      location: "Camp",
      action: "start-quest",
    });

    // If the game state says we're currently in a quest, then we should re-direct ot that quest.
    if (gameState?.active_mode === "quest" && gameState?.current_quest) {
      log.debug(`Activating existing quest: ${gameState?.current_quest}`);
      router.push(`/play/${params.handle}/quest/${gameState?.current_quest}`);
      setIsLoading(false);
      return;
    }

    // IF we're still here, then we need to start a new quest.
    const resp = await fetch(`/api/game/${params.handle}/quest`, {
      method: "POST",
    });
    if (!resp.ok) {
      setIsLoading(false);
      setIsVisible(false);
      let res = "";
      try {
        res = await resp.text();
      } catch {
        alert(`Failed to start quest: ${res}`);
        log.error(`Failed to start quest: ${res}`);
        return;
      }
      alert(`Failed to start quest: ${res}`);
      log.error(`Failed to start quest: ${res}`);
      return;
    }
    const json = (await resp.json()) as {
      quest: Quest & { status: { state: string; statusMessage: string } };
    };
    if (json?.quest?.status?.state === "failed") {
      setIsLoading(false);
      setIsVisible(false);
      alert(`Failed to start quest: ${JSON.stringify(json)}`);
      log.error(`Failed to start quest: ${JSON.stringify(json)}`);
      return;
    }

    const questId = json.quest.name;
    if (!questId) {
      setIsLoading(false);
      setIsVisible(false);
      alert(`Failed to get questId: ${JSON.stringify(json)}`);
      log.error(`Failed to get QuestId: ${JSON.stringify(json)}`);
      return;
    }

    log.debug(`Activating new quest: ${questId}`);
    router.push(`/play/${params.handle}/quest/${questId}`);
    setIsLoading(false);
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
              "bg-gradient-to-b from-indigo-200 via-orange-200 to-muted"
          )}
        >
          <div className="absolute h-full w-full top-0 left-0">
            <div className="w-full h-full flex items-center justify-center">
              <div
                className={cn(
                  "rounded-full w-8 h-8 absolute",
                  disabledQuest && "bg-muted",
                  isCompleteQuest && "bg-indigo-200",
                  isCurrentquest && "bg-white"
                )}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {isCompleteQuest && (
                    <CheckIcon size={16} className="text-black" />
                  )}
                  {isCurrentquest && (
                    <SparklesIcon size={16} className="text-black" />
                  )}
                  {disabledQuest && <LockIcon size={16} />}
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
        <CardHeader className="gap-6">
          <div>
            <TypographyMuted className="text-xs font-bold mb-2">
              Location
            </TypographyMuted>
            <CardTitle>{questArc.location}</CardTitle>
          </div>
          <div>
            <TypographyMuted className="text-xs font-bold mb-2">
              Goal
            </TypographyMuted>
            <CardDescription>{questArc.goal}</CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          {isCurrentquest && (
            <Button
              onClick={onClick}
              className="bg-indigo-600 text-white hover:bg-indigo-800"
              disabled={isLoading}
            >
              <SparklesIcon className="mr-2" />
              {isInQuest ? "Continue Quest" : "Start Quest"}
            </Button>
          )}
          {disabledQuest && (
            <Button variant="outline" disabled>
              Start Quest
            </Button>
          )}
          {isCompleteQuest && (
            <Button onClick={onClick} variant="outline" disabled={isLoading}>
              View Quest
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
}: {
  adventureGoal?: string;
  adventure?: Pick<Adventure, "name" | "agentConfig"> | null;
}) => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const [isClamped, setIsClamped] = useState(true);
  const [isArcClamped, setIsArcClamped] = useState(true);
  const params = useParams<{ handle: string }>();
  const [lowEnergyModalOpen, setLowEnergyModalOpen] = useState(false);
  const { loadingScreen, setIsVisible } = useLoadingScreen("Starting Quest...");

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
        <InventorySheet>
          <Button
            onClick={(e) => {
              amplitude.track("Button Click", {
                buttonName: "View Inventory",
                location: "Camp",
                action: "view-inventory",
              });
            }}
            variant="outline"
          >
            <PackageIcon className="h-4 w-4" />
          </Button>
        </InventorySheet>
      </div>
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
              setIsVisible={setIsVisible}
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
      {loadingScreen}
    </>
  );
};
