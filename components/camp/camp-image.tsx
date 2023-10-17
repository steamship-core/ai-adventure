"use client";
import { getGameState } from "@/lib/game/game-state.client";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { Skeleton } from "../ui/skeleton";

export const CampImage = async () => {
  const gameState = useRecoilValue(recoilGameState);
  const [campPic, setCampPic] = useState<string | undefined>(
    gameState?.camp?.image_block_url
  );

  useEffect(() => {
    const refreshCampPic = async () => {
      const gs = await getGameState();
      if (gs?.camp?.image_block_url) {
        setCampPic(gs.camp.image_block_url);
      }
    };
    const interval = setInterval(() => {
      if (campPic) return;
      refreshCampPic();
    }, 1500);
    return () => {
      clearInterval(interval);
    };
  }, [campPic]);

  return (
    <div className="px-8 sm:px-12 my-2">
      <div className="relative rounded-lg overflow-hidden w-full aspect-square -z-20">
        {campPic ? (
          <img src={campPic} alt="background" className="object-cover -z-10" />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    </div>
  );
};
