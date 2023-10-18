"use client";
import { CampMembers } from "@/camp-members";
import { getGameState } from "@/lib/game/game-state.client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
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
          <div className="flex flex-col gap-4 md:max-w-xl md:mx-auto">
            <CampMembers />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
