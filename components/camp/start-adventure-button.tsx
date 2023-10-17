"use client";
import { Quest } from "@/lib/game/schema/quest";
import { track } from "@vercel/analytics/react";
import { SparklesIcon } from "lucide-react";
import { log } from "next-axiom";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useLoadingScreen from "../loading/use-loading-screen";
import { recoilGameState } from "../recoil-provider";
import { Button } from "../ui/button";

const StartAdventureButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loadingScreen, setIsVisible } = useLoadingScreen();
  const gameState = useRecoilValue(recoilGameState);
  console.log(gameState.player.inventory);

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
      router.push(`/play/quest/${gameState?.current_quest}`);
      setIsLoading(false);
      return;
    }

    const resp = await fetch("/api/game/quest", { method: "POST" });
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
      router.push(`/play/quest/${questId}`);
    }
    setIsLoading(false);
  };

  const lowEnergy = (gameState?.player?.energy || 0) < 10;

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={isLoading || lowEnergy}
        className="w-full flex justify-start"
      >
        <SparklesIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        {gameState?.active_mode === "quest" && gameState?.current_quest ? (
          <>Continue Adventure</>
        ) : (
          <>Go on an Adventure</>
        )}
      </Button>
      {loadingScreen}
    </>
  );
};

export default StartAdventureButton;
