"use client";

import { PackageIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { GameState } from "@/lib/game/schema/game_state";
import { TypographySmall } from "./ui/typography/TypographySmall";
import { cn } from "@/lib/utils";
import { InventoryList } from "./inventory-list";

const InventorySheet = ({
  gameState,
  text = "View Inventory",
}: {
  gameState: GameState;
  text?: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PackageIcon size={16} className={cn(text && "mr-2")} />
          {text}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0"
      >
        <SheetHeader>
          <SheetTitle>Inventory</SheetTitle>
          <SheetDescription>
            Items you&apos;e collected on your adventures. They might just be
            junk, or they might be useful.
          </SheetDescription>
        </SheetHeader>
        <TypographySmall>Grid view</TypographySmall>
        <InventoryList inventory={gameState?.player?.inventory || []} />
      </SheetContent>
    </Sheet>
  );
};

export default InventorySheet;
