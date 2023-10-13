"use client";
import { CompassIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Quest } from "@/lib/game/schema/quest";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLoadingScreen from "../loading/use-loading-screen";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { log } from "next-axiom";

const StartAdventureButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loadingScreen, setIsVisible } = useLoadingScreen();
  const gameState = useRecoilValue(recoilGameState);
  const onClick = async () => {
    setIsVisible(true);
    setIsLoading(true);

    // If the game state says we're currently in a quest, then we should re-direct ot that quest.
    if (gameState?.active_mode == "quest" && gameState?.current_quest) {
      console.log(`Activating existing quest: ${gameState?.current_quest}`);
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

    log.debug(`Activating new quest: ${json.quest.chat_file_id}`);
    if (json.quest.chat_file_id) {
      router.push(`/play/quest/${json.quest.chat_file_id}`);
    }
    setIsLoading(false);
  };

  console.log(gameState);
  const lowEnergy = (gameState?.player?.energy || 0) < 10;

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={isLoading || lowEnergy}
      >
        <CompassIcon className="mr-2" size={16} />
        Go on an adventure{lowEnergy ? " (low energy)" : ""}
      </Button>
      {loadingScreen}
    </>
  );
};

export default StartAdventureButton;
