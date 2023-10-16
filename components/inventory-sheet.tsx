"use client";

import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { InventoryList } from "./inventory-list";
import { recoilGameState } from "./recoil-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const InventorySheet = ({ children }: { children: ReactNode }) => {
  const gameState = useRecoilValue(recoilGameState);
  console.log(gameState);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col max-w-4xl mx-auto p-6"
      >
        <SheetHeader>
          <SheetTitle>Inventory</SheetTitle>
          <SheetDescription>
            Items you&apos;ve collected on your adventures. They might just be
            junk, or they might be useful.
          </SheetDescription>
        </SheetHeader>
        <InventoryList inventory={gameState?.player?.inventory || []} />
      </SheetContent>
    </Sheet>
  );
};

export default InventorySheet;
