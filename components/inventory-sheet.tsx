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
import { TypographyMuted } from "./ui/typography/TypographyMuted";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { Switch } from "@/components/ui/switch";
import { use, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const InventorySheet = ({ gameState }: { gameState: GameState }) => {
  const [useGridView, setUseGridView] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem("useGridView");
    if (preference) {
      setUseGridView(JSON.parse(preference));
    }
  }, [useGridView]);

  const toggleGridView = (checked: boolean) => {
    setUseGridView(checked);
    localStorage.setItem("useGridView", checked.toString());
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PackageIcon size={16} className="mr-2" /> View Inventory
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
        <Switch checked={useGridView} onCheckedChange={toggleGridView} />
        <div className="flex w-full overflow-hidden">
          {useGridView ? (
            <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
              {gameState?.player?.inventory?.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-center"
                >
                  <HoverCard>
                    <HoverCardTrigger>
                      <button className="flex items-center justify-center aspect-square border border-foreground/20 p-2 rounded-md">
                        <PackageIcon className="w-8 h-8" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="max-w-sm">
                        <TypographyLarge>{item.name}</TypographyLarge>
                        <TypographyMuted>{item.description}</TypographyMuted>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-5 mt-8 pb-8 overflow-scroll">
              {gameState?.player?.inventory?.map((item, i) => (
                <div
                  key={item.name}
                  className="border flex rounded-md border-foreground/20 p-4 gap-4"
                >
                  <div>
                    <PackageIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <TypographyLarge>{item.name}</TypographyLarge>
                    <TypographyMuted>{item.description}</TypographyMuted>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InventorySheet;
