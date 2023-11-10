"use client";

import { ActivityIcon, PackageIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import BackgroundAudioToggle from "../audio/background-audio-toggle";
import InventorySheet from "../inventory-sheet";
import { recoilEnergyState } from "../providers/recoil";
import { Button } from "../ui/button";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const SummaryStats = ({
  showEnergy = true,
  showAudio = true,
  showInventory = true,
}: {
  showEnergy?: boolean;
  showAudio?: boolean;
  showInventory?: boolean;
}) => {
  const energy = useRecoilValue(recoilEnergyState);

  return (
    <div className="flex flex-row items-center gap-2" id="stats">
      {showAudio && <BackgroundAudioToggle text="" />}
      {showInventory && (
        <InventorySheet>
          <Button
            variant="outline"
            size="icon"
            className="px-2 py-1 md:px-3 md:py-3 h-8 md:h-10"
          >
            <PackageIcon size={16} />
          </Button>
        </InventorySheet>
      )}
      {showEnergy && (
        <TypographySmall className="flex items-center">
          <ActivityIcon size={16} className="mr-2 text-indigo-400" />
          {energy || 0}
        </TypographySmall>
      )}
    </div>
  );
};
