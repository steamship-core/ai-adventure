"use client";
import { Quest } from "@/lib/game/schema/quest";
import { track } from "@vercel/analytics/react";
import { SparklesIcon } from "lucide-react";
import { log } from "next-axiom";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useLoadingScreen from "../loading/use-loading-screen";
import { recoilEnergyState, recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";

const StartAdventureButton = () => {
  const router = useRouter();
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

    const resp = await fetch(`/api/game/${params.handle}/quest`, {
      method: "POST",
    });
    if (!resp.ok) {
      setIsLoading(false);
      setIsVisible(false);
      let res = "";
      try {
        res = await resp.text();
      } catch {}
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

  const lowEnergy = (energy || 0) < 10;

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={
          isLoading ||
          lowEnergy ||
          !gameState.quest_arc ||
          gameState.quest_arc.length === 0
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
      {loadingScreen}
    </>
  );
};

export default StartAdventureButton;
