"use client";

import { FlameIcon, PackageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import InventorySheet from "../inventory-sheet";
import { recoilEnergyState } from "../providers/recoil";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TypographySmall } from "../ui/typography/TypographySmall";

const BackgroundAudioToggle = dynamic(
  () => import("../audio/background-audio-toggle"),
  { ssr: false }
);

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
        <Dialog>
          <DialogTrigger>
            <TypographySmall className="flex items-center">
              <FlameIcon size={16} className="mr-2 text-orange-400" />
              {energy || 0}
            </TypographySmall>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center">
                Energy
              </DialogTitle>
              <DialogDescription>
                Looking to purchase more energy? Click below to visit the energy
                store.
              </DialogDescription>
            </DialogHeader>
            <Button
              asChild
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              <Link href="/account/plan">
                Purchase Energy <FlameIcon className="ml-2" />
              </Link>
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
