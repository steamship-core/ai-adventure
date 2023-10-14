"use client";

import { ActivityIcon, BadgeDollarSignIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const SummaryStats = () => {
  const gameState = useRecoilValue(recoilGameState);

  return (
    <div className="flex flex-col items-end gap-2">
      <TypographySmall className="flex items-center">
        <ActivityIcon size={16} className="mr-2 text-indigo-400" />
        100/100
      </TypographySmall>
      <TypographySmall className="flex items-center">
        <BadgeDollarSignIcon size={16} className="mr-2 text-yellow-400" />
        {gameState?.player?.gold || 0}
      </TypographySmall>
    </div>
  );
};
