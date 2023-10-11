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
import { NpcCharacter } from "@/lib/game/schema/characters";
import { Item } from "@/lib/game/schema/objects";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { recoilGameState } from "./recoil-provider";
import { useRecoilValue } from "recoil";

const MerchantSheet = ({ member }: { member: NpcCharacter }) => {
  const gameState = useRecoilValue(recoilGameState);

  const [selectedToSell, setSelectedToSell] = useState<Item[]>([]);
  const [selectedToBuy, setSelectedToBuy] = useState<Item[]>([]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center">
          <div className="h-28 w-28 relative rounded-full overflow-hidden drop-shadow-2xl border-yellow-400 border">
            <Image
              src={"/merchant.png"}
              fill
              alt="A merchant"
              className="object-cover"
            />
          </div>
          {member.name}
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0"
      >
        <SheetHeader>
          <SheetTitle>{member.name}</SheetTitle>
          <SheetDescription>{member.description}</SheetDescription>
        </SheetHeader>
        <div className="w-full overflow-scroll">
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
                    {selectedToSell.map((item) => (
                      <div
                        key={item.name!}
                        className="flex items-center justify-center"
                      >
                        <div className="border rounded-md border-foreground/20 h-12 aspect-square relative overflow-hidden">
                          <Image
                            src={"/orb.png"}
                            fill
                            alt={item.description!}
                            className="object-cover"
                          />
                        </div>
                      </div>
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
                        key={item.name!}
                        className="flex items-center justify-center"
                      >
                        <div className="border rounded-md border-foreground/20 h-12 aspect-square relative overflow-hidden">
                          <Image
                            src={"/orb.png"}
                            fill
                            alt={item.description!}
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
          <TypographyP>Wares for sale</TypographyP>
          <TypographyMuted>
            Select an item to view it&apos;s cost
          </TypographyMuted>
          <div className="flex w-full overflow-hidden">
            <div className="w-full flex flex-col gap-5 mt-8 pb-8">
              {member.inventory.map((item, i) => (
                <button
                  key={i}
                  className="flex gap-2 text-left"
                  onClick={() => {
                    if (
                      selectedToBuy.find((value) => value.name === item.name!)
                    ) {
                      setSelectedToBuy((prev) =>
                        prev.filter((j) => j.name !== item.name!)
                      );
                    } else {
                      setSelectedToBuy((prev) => [...prev, item]);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "border rounded-md h-12 aspect-square relative overflow-hidden"
                    )}
                  >
                    <Image
                      src={"/orb.png"}
                      fill
                      alt={item.description!}
                      className="object-cover"
                    />
                    {selectedToBuy.find(
                      (value) => value.name === item.name
                    ) && (
                      <div className="absolute top-0 left-0 bg-background/50 w-full h-full z-20 flex items-center justify-center">
                        <CheckIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <TypographyLarge>{item.name}</TypographyLarge>
                    <TypographyMuted>
                      {item.description ||
                        `No description can be found for this item. It's purpose has been lost to time.`}
                    </TypographyMuted>
                  </div>
                </button>
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
            <div className="w-full flex flex-col gap-5 mt-8 pb-8">
              {gameState.player.inventory.map((item, i) => (
                <button
                  key={i}
                  className="flex gap-2 text-left"
                  onClick={() => {
                    if (
                      selectedToSell.find((value) => value.name === item.name!)
                    ) {
                      setSelectedToSell((prev) =>
                        prev.filter((j) => j.name !== item.name!)
                      );
                    } else {
                      setSelectedToSell((prev) => [...prev, item]);
                    }
                  }}
                >
                  <div>
                    <div
                      className={cn(
                        "border rounded-md h-12 aspect-square relative overflow-hidden"
                      )}
                    >
                      <Image
                        src={"/orb.png"}
                        fill
                        alt={item.description!}
                        className="object-cover"
                      />
                      {selectedToSell.find(
                        (value) => value.name === item.name
                      ) && (
                        <div className="absolute top-0 left-0 bg-background/50 w-full h-full z-20 flex items-center justify-center">
                          <CheckIcon size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <TypographyLarge>{item.name}</TypographyLarge>
                    <TypographyMuted>
                      {item.description ||
                        `No description can be found for this item. It's purpose has been lost to time.`}
                    </TypographyMuted>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const InteractionSheet = ({ member }: { member: NpcCharacter }) => {
  if (member.name === "The Merchant") {
    return <MerchantSheet member={member} />;
  }
  return null;
};

export default InteractionSheet;
