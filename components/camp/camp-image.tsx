"use client";
import { getGameState } from "@/lib/game/game-state.client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilGameState } from "../providers/recoil";
import { Skeleton } from "../ui/skeleton";

export const CampImage = () => {
  const [gameState] = useRecoilState(recoilGameState);
  const [campPic, setCampPic] = useState<string | undefined>(
    gameState?.camp?.image_block_url
  );
  const params = useParams<{ handle: string }>();

  const { data: imageUrl } = useQuery({
    queryKey: ["camp-image", gameState?.camp?.image_block_url],
    queryFn: async () => {
      if (!gameState?.camp?.image_block_url) return;
      const res = await fetch(gameState?.camp?.image_block_url);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        return url;
      }
    },
  });

  useEffect(() => {
    const refreshCampPic = async () => {
      const gs = await getGameState(params.handle);
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

  // useEffect(() => {
  //   const refreshInventory = async () => {
  //     const res = await fetch("/api/game/trade/refresh-inventory", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         npc_name: "The Merchant",
  //       }),
  //     });
  //     if (res.ok) {
  //       const json = await res.json();
  //       if (json.updated) {
  //         const gameState = await getGameState();
  //         setGameState(gameState);
  //       }
  //     }
  //   };
  //   refreshInventory();
  // }, []);

  return (
    <div className="relative rounded-lg overflow-hidden w-full aspect-video">
      {imageUrl ? (
        <Image
          fill
          src={imageUrl}
          alt="background"
          className="object-cover -z-10"
          sizes="528px"
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
  // return (
  //   <div className="my-2">
  //     <Sheet>
  //       <SheetTrigger asChild>
  //         <button className="relative rounded-lg overflow-hidden w-full aspect-video">
  //           {campPic ? (
  //             <Image
  //               fill
  //               src={campPic}
  //               alt="background"
  //               className="object-cover -z-10"
  //               sizes="528px"
  //             />
  //           ) : (
  //             <Skeleton className="w-full h-full" />
  //           )}
  //         </button>
  //       </SheetTrigger>
  //       <SheetContent
  //         side="bottom"
  //         className="w-100% h-[100dvh] flex flex-col pb-0 overflow-y-auto"
  //       >
  //         <SheetHeader>
  //           <SheetTitle>Camp Members</SheetTitle>
  //           <SheetDescription>
  //             This is a list of everyone resting at camp. Click on someone to
  //             interact with them.
  //           </SheetDescription>
  //         </SheetHeader>
  //         <SheetBody>
  //           <div className="flex flex-col gap-4">
  //             <CampMembers />
  //           </div>
  //         </SheetBody>
  //       </SheetContent>
  //     </Sheet>
  //   </div>
  // );
};
