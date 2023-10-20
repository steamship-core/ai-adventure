"use client";
import { CampMembers } from "@/camp-members";
import { getGameState } from "@/lib/game/game-state.client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilGameState } from "../providers/recoil";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";

export const CampImage = () => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
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

  useEffect(() => {
    const refreshInventory = async () => {
      const start = Date.now();
      const res = await fetch("/api/game/trade/refresh-inventory", {
        method: "POST",
        body: JSON.stringify({
          npc_name: "The Merchant",
        }),
      });
      const end = Date.now();
      const elapsed = end - start;
      console.log(`Refreshed inventory in ${elapsed}ms`);
      if (res.ok) {
        const json = await res.json();
        if (json.updated) {
          console.log("updating inv");
          const gameState = await getGameState();
          setGameState(gameState);
        }
      }
    };
    refreshInventory();
  }, []);

  return (
    <div className="my-2">
      <Sheet>
        <SheetTrigger asChild>
          <button className="relative rounded-lg overflow-hidden w-full aspect-video">
            {campPic ? (
              <Image
                fill
                src={campPic}
                alt="background"
                className="object-cover -z-10"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="w-100% h-[100dvh] flex flex-col pb-0 overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Camp Members</SheetTitle>
            <SheetDescription>
              This is a list of everyone resting at camp. Click on someone to
              interact with them.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <div className="flex flex-col gap-4">
              <CampMembers />
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
};
