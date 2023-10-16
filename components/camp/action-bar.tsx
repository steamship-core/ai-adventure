"use client";
import { track } from "@vercel/analytics/react";
import { CompassIcon, PackageIcon } from "lucide-react";
import InventorySheet from "../inventory-sheet";
import { Button } from "../ui/button";
import StartAdventureButton from "./start-adventure-button";

export const ActionBar = () => {
  return (
    <div className="w-full">
      <div className="flex w-full  flex-col justify-center items-center gap-2">
        <StartAdventureButton />
        <InventorySheet>
          <Button
            onClick={(e) =>
              track("Click Button", { buttonName: "View Inventory" })
            }
            variant="outline"
            className="w-full flex justify-start"
          >
            <PackageIcon size={16} className="h-6 w-6 mr-2" />
            View Inventory
          </Button>
        </InventorySheet>
        <Button variant="outline" className="w-full flex justify-start">
          <CompassIcon size={16} className="h-6 w-6 mr-2" />
          Adventure History
        </Button>
      </div>
    </div>
  );
};
