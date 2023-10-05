"use client";
import { CheckIcon, CoinsIcon, PackageIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { TypographyMuted } from "./ui/typography/TypographyMuted";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TypographyP } from "./ui/typography/TypographyP";

export type InventoryItem = {
  id: string;
  name: string;
  image: string;
  description: string;
};
export type CampMember = {
  id: string;
  name: string;
  image: string;
  description: string;
  actionTitle: string;
  actionDescription: string;
  inventory: InventoryItem[];
};

const MerchantSheet = ({ member }: { member: CampMember }) => {
  const [selectedToSell, setSelectedToSell] = useState<number[]>([]);
  const [selectedToBuy, setSelectedToBuy] = useState<InventoryItem[]>([]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex flex-col items-center">
          <div className="h-28 w-28 relative rounded-full overflow-hidden drop-shadow-2xl border-yellow-400 border">
            <Image
              src={member.image}
              fill
              alt="A merchant"
              className="object-cover"
            />
          </div>
          {member.name}
        </div>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0"
      >
        <SheetHeader>
          <SheetTitle>{member.name}</SheetTitle>
          <SheetDescription>{member.description}</SheetDescription>
        </SheetHeader>
        {(selectedToSell.length > 0 || selectedToBuy.length > 0) && (
          <div className="flex flex-col gap-2 border rounded-md p-4 border-blue-500">
            <div className="flex items-center">
              Your Gold:{" "}
              <CoinsIcon size={16} className="text-yellow-400 ml-4 mr-2" />
              <span className="text-yellow-400">0</span>
            </div>
            {selectedToSell.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <TypographyP>Items to Sell</TypographyP>
                  <div className="flex items-center gap-2">
                    <CoinsIcon size={16} className="text-yellow-400" />
                    <div className="text-yellow-400">
                      {selectedToSell.length * 24}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedToSell.map((i) => (
                    <div
                      key={i}
                      className="border rounded-md border-foreground/20 h-12 aspect-square"
                    />
                  ))}
                </div>
              </>
            )}
            {selectedToBuy.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <TypographyP>Items to Purchase</TypographyP>
                  <div className="flex items-center gap-2">
                    <CoinsIcon size={16} className="text-red-400" />
                    <div className="text-red-400">
                      {selectedToBuy.length * 24}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedToBuy.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-center"
                    >
                      <div className="border rounded-md border-foreground/20 h-12 aspect-square relative overflow-hidden">
                        <Image
                          src={item.image}
                          fill
                          alt={item.description}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button>Complete Trade</Button>
          </div>
        )}
        Wares for sale
        <TypographyMuted>Select an item to view it&apos;s cost</TypographyMuted>
        <div className="flex w-full overflow-hidden">
          <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
            {member.inventory.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                onClick={() => {
                  if (selectedToBuy.find((value) => value.id === item.id)) {
                    setSelectedToBuy((prev) =>
                      prev.filter((j) => j.id !== item.id)
                    );
                  } else {
                    setSelectedToBuy((prev) => [...prev, item]);
                  }
                }}
              >
                <div
                  className={cn(
                    "border rounded-md  h-12 aspect-square relative overflow-hidden"
                  )}
                >
                  <Image
                    src={item.image}
                    fill
                    alt={item.description}
                    className="object-cover"
                  />
                  {selectedToBuy.find((value) => value.id === item.id) && (
                    <div className="absolute top-0 left-0 bg-background/50 w-full h-full z-20 flex items-center justify-center">
                      <CheckIcon size={32} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {member.inventory.length === 0 && (
              <div className="flex flex-col items-center justify-center col-span-full">
                <PackageIcon size={32} className="mb-2" />
                <div className="text-sm text-foreground/50">
                  No items for sale
                </div>
              </div>
            )}
          </div>
        </div>
        Your Inventory
        <TypographyMuted>
          Select an item to view it&apos;s value
        </TypographyMuted>
        <div className="flex w-full overflow-hidden">
          <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center cursor-pointer"
                )}
                onClick={() => {
                  if (selectedToSell.indexOf(i) !== -1) {
                    setSelectedToSell((prev) => prev.filter((j) => j !== i));
                  } else {
                    setSelectedToSell((prev) => [...prev, i]);
                  }
                }}
              >
                <div
                  className={cn(
                    "border rounded-md  h-12 aspect-square relative"
                  )}
                >
                  {selectedToSell.indexOf(i) !== -1 && (
                    <div className="absolute top-0 left-0 bg-background/50 w-full h-full z-20 flex items-center justify-center">
                      <CheckIcon size={32} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const InteractionSheet = ({ member }: { member: CampMember }) => {
  if (member.id === "the-merchant") {
    return <MerchantSheet member={member} />;
  }
  return null;
};

export default InteractionSheet;
