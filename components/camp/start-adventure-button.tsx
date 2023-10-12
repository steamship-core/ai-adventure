"use client";
import { CompassIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Quest } from "@/lib/game/schema/quest";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLoadingScreen from "../loading/use-loading-screen";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";

const StartAdventureButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loadingScreen, setIsVisible } = useLoadingScreen();
  const gameState = useRecoilValue(recoilGameState);
  const onClick = async () => {
    setIsVisible(true);
    setIsLoading(true);
    const resp = await fetch("/api/game/quest", { method: "POST" });
    console.log("resp", resp);
    if (!resp.ok) {
      setIsLoading(false);
      setIsVisible(false);
      return;
    }
    const json = (await resp.json()) as {
      quest: Quest & { status: { state: string; statusMessage: string } };
    };
    console.log(json);
    if (json?.quest?.status?.state === "failed") {
      setIsLoading(false);
      setIsVisible(false);
      return;
    }
    if (json.quest.chat_file_id) {
      router.push(`/play/quest/${json.quest.chat_file_id}`);
    }
    setIsLoading(false);
  };

  const lowEnergy = (gameState.player.energy || 0) < 10;

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
