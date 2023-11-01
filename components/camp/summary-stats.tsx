"use client";

import { ActivityIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { recoilEnergyState } from "../providers/recoil";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const SummaryStats = async () => {
  const energy = useRecoilValue(recoilEnergyState);

  return (
    <div className="flex flex-col items-end gap-2" id="stats">
      <TypographySmall className="flex items-center">
        <ActivityIcon size={16} className="mr-2 text-indigo-400" />
        {energy || 0}
      </TypographySmall>
    </div>
  );
};
