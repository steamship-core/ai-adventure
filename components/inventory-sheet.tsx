"use client";

import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { InventoryList } from "./inventory-list";
import { recoilGameState } from "./providers/recoil";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const InventorySheet = ({ children }: { children: ReactNode }) => {
  const gameState = useRecoilValue(recoilGameState);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col max-w-4xl mx-auto"
      >
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
