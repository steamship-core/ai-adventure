"use client";

import { PackageIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { InventoryList } from "./inventory-list";
import { recoilGameState } from "./providers/recoil";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const InventorySheet = ({ onClick }: { onClick?: () => void }) => {
  const gameState = useRecoilValue(recoilGameState);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="px-2 py-1 md:px-3 md:py-3 h-8 md:h-10"
          onClick={onClick}
        >
          <PackageIcon size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full h-[100dvh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Inventory</SheetTitle>
          <SheetDescription>
            Items you&apos;ve collected on your adventures. They might just be
            junk, or they might be useful.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <InventoryList inventory={gameState?.player?.inventory || []} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};

export default InventorySheet;
