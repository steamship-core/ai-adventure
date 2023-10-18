"use client";
import { track } from "@vercel/analytics/react";
import { PackageIcon } from "lucide-react";
import InventorySheet from "../inventory-sheet";
import { Button } from "../ui/button";
import { AdventureHistorySheet } from "./adventure-history-sheet";
import StartAdventureButton from "./start-adventure-button";
export const ActionBar = () => {
  return (
    <div className="w-full">
      <div className="flex w-full  flex-col justify-center items-center gap-2">
        <StartAdventureButton />
        <div className="w-full grid grid-cols-2 gap-2">
          <InventorySheet>
            <Button
              onClick={(e) => {
                track("Click Button", {
                  buttonName: "View Inventory",
                  location: "Camp",
                });
              }}
              variant="outline"
              className="w-full flex justify-start"
            >
              <PackageIcon className="h-4 w-4 md:h-6 md:w-6 mr-2" />
              Inventory
            </Button>
          </InventorySheet>
          <AdventureHistorySheet />
        </div>
      </div>
    </div>
  );
};
