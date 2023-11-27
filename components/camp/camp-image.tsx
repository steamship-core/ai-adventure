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
};
