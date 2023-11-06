"use client";

import { ActivityIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import BackgroundAudioToggle from "../audio/background-audio-toggle";
import { recoilEnergyState } from "../providers/recoil";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const SummaryStats = () => {
  const energy = useRecoilValue(recoilEnergyState);

  return (
    <div className="flex flex-row items-center gap-2" id="stats">
      <BackgroundAudioToggle text="" /> &nbsp;
      <TypographySmall className="flex items-center">
        <ActivityIcon size={16} className="mr-2 text-indigo-400" />
        {energy || 0}
      </TypographySmall>
    </div>
  );
};
