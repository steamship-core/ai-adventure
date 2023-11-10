"use client";
import { Quest } from "@/lib/game/schema/quest";
import { track } from "@vercel/analytics/react";
import { SparklesIcon, ZapIcon, ZapOffIcon } from "lucide-react";
import { log } from "next-axiom";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useLoadingScreen from "../loading/use-loading-screen";
import { recoilEnergyState, recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const StartAdventureButton = () => {
  const router = useRouter();
  const [lowEnergyModalOpen, setLowEnergyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadingScreen, setIsVisible } = useLoadingScreen("Starting Quest...");
  const gameState = useRecoilValue(recoilGameState);
  const energy = useRecoilValue(recoilEnergyState);

  const params = useParams();
  const questArc = gameState?.quest_arc || [];
  const questCount = gameState?.current_quest
    ? gameState?.quests?.length - 1
    : gameState?.quests?.length;

  const currentQuestArc =
    questCount > questArc.length ? null : questArc[questCount];

  const onClick = async () => {
    const lowEnergy = (energy || 0) < 10;
    if (lowEnergy) {
      setLowEnergyModalOpen(true);
      return;
    }
    setIsVisible(true);
    setIsLoading(true);
    track("Click Button", {
      buttonName: "Go on an Adventure",
      location: "Camp",
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
      return;
    }

    const questId = json.quest.name;

    log.debug(`Activating new quest: ${questId}`);
    if (questId) {
      router.push(`/play/${params.handle}/quest/${questId}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={
          isLoading || !gameState.quest_arc || gameState.quest_arc.length === 0
        }
        className="w-full flex justify-start"
      >
        <SparklesIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        {gameState?.active_mode === "quest" && gameState?.current_quest ? (
          <p className="line-clamp-1 text-left">
            {currentQuestArc
              ? `Continue Adventure: ${currentQuestArc.location}`
              : "Continue Adventure"}
          </p>
        ) : (
          <p className="line-clamp-1 text-left">
            {currentQuestArc
              ? `Start Quest: ${currentQuestArc.location}`
              : "Go on a Quest"}{" "}
          </p>
        )}
      </Button>
      <Dialog
        open={lowEnergyModalOpen}
        onOpenChange={(o) => setLowEnergyModalOpen(o)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <ZapOffIcon /> Out of Energy!
            </DialogTitle>
            <DialogDescription>
              You&apos;ve ran out of energy. You can either wait for your energy
              to recharge, or you can purchase more energy.
            </DialogDescription>
          </DialogHeader>
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-800"
          >
            <Link href="/account/plan">
              Purchase Energy <ZapIcon className="ml-2" />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
      {loadingScreen}
    </>
  );
};

export default StartAdventureButton;
