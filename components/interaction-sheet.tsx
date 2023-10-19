"use client";
import { getGameState } from "@/lib/game/game-state.client";
import { NpcCharacter } from "@/lib/game/schema/characters";
import { Item } from "@/lib/game/schema/objects";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics/react";
import { CoinsIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { InventoryList } from "./inventory-list";
import { recoilGameState } from "./recoil-provider";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { TypographyMuted } from "./ui/typography/TypographyMuted";
import { TypographyP } from "./ui/typography/TypographyP";
import { TypographySmall } from "./ui/typography/TypographySmall";

const MerchantSheet = ({ member }: { member: NpcCharacter }) => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const [selectedToSell, setSelectedToSell] = useState<Item[]>([]);
  const [selectedToBuy, setSelectedToBuy] = useState<Item[]>([]);
  const [isTrading, setIsTrading] = useState(false);

  const trade = async () => {
    setIsTrading(true);
    const counter_party = member.name;
    const sell = selectedToSell.map((item) => item.name);
    const buy = selectedToBuy.map((item) => item.name);
    track("Trade Item", {
      buttonName: "Complete Trade",
      location: "Camp",
      itemsToSell: sell.length,
      itemsToBuy: buy.length,
    });

    const resp = await fetch("/api/game/trade", {
      method: "POST",
      body: JSON.stringify({
        counter_party,
        sell,
        buy,
      }),
    });
    const newGameState = await getGameState();
    setGameState(newGameState);
    setSelectedToBuy([]);
    setSelectedToSell([]);
    setIsTrading(false);
  };

  const totalSellPrice = selectedToSell.reduce((acc, item) => {
    return acc + 42 * (item.modifier || 1);
  }, 0);

  const totalPurchasePrice = selectedToBuy.reduce((acc, item) => {
    return acc + 42 * (item.modifier || 1);
  }, 0);

  const totalSale = totalSellPrice - totalPurchasePrice;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          onClick={() => {
            track("Click Camp Member", {
              buttonName: member.name,
              location: "Camp",
            });
          }}
          className="flex gap-4 hover:bg-foreground/10 rounded-md"
        >
          <div className="flex items-center justify-center h-full">
            <div className="relative overflow-hidden h-20 md:h-24 aspect-square rounded-md border border-blue-foreground/90">
              <Image
                src={"/merchant.png"}
                fill
                alt="A merchant"
                className="object-cover z-10"
              />
            </div>
          </div>
          <div className="flex flex-col items-start text-start">
            <TypographyLarge>{member.name}</TypographyLarge>
            <TypographyMuted>{member.description}</TypographyMuted>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full h-[100dvh] flex flex-col">
        <SheetHeader>
          <div className="flex gap-4 rounded-md">
            <div className="flex items-center justify-center h-full">
              <div className="relative overflow-hidden h-20 md:h-24 aspect-square rounded-md border border-blue-foreground/90">
                <Image
                  src={"/merchant.png"}
                  fill
                  alt="A merchant"
                  className="object-cover z-10"
                />
              </div>
            </div>
            <div className="flex flex-col items-start text-start">
              <TypographyLarge className="text-foreground">
                {member.name}
              </TypographyLarge>
              <TypographyMuted className="md:w-[75%]">
                {member.description}
              </TypographyMuted>
            </div>
          </div>
        </SheetHeader>
        <div className="flex items-center">
          <TypographyMuted>Your Gold:</TypographyMuted>
          <CoinsIcon size={12} className="text-yellow-400 ml-4 mr-2" />
          <TypographyMuted className="text-yellow-400">
            {gameState?.player?.gold}
          </TypographyMuted>
        </div>
        <SheetBody>
          {(selectedToSell.length > 0 || selectedToBuy.length > 0) && (
            <div className="flex flex-col gap-2">
              {selectedToSell.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <TypographySmall>
                      Selling {selectedToSell.length} item
                      {selectedToSell.length > 1 && "s"}
                    </TypographySmall>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedToSell.map((item) => (
                      <div
                        key={item.name!}
                        className="flex items-center justify-center"
                      >
                        <div className="border rounded-md border-foreground/20 h-12 aspect-square relative overflow-hidden">
                          {item.picture_url ? (
                            <Image
                              src={item.picture_url}
                              fill
                              alt={item.description!}
                              className="object-cover"
                            />
                          ) : (
                            <PackageIcon size={32} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {selectedToBuy.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <TypographySmall>
                      Buying {selectedToBuy.length} item
                      {selectedToBuy.length > 1 && "s"}
                    </TypographySmall>
                    <div className="flex items-center gap-2"></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedToBuy.map((item) => (
                      <div
                        key={item.name!}
                        className="flex items-center justify-center"
                      >
                        <div className="border rounded-md border-foreground/20 h-12 aspect-square relative overflow-hidden flex items-center justify-center">
                          {item.picture_url ? (
                            <Image
                              src={item.picture_url}
                              fill
                              alt={item.description!}
                              className="object-cover"
                            />
                          ) : (
                            <PackageIcon size={24} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <Button
                onClick={trade}
                isLoading={isTrading}
                disabled={
                  isTrading ||
                  (totalSale < 0 &&
                    (gameState?.player?.gold || 0) < Math.abs(totalSale))
                }
              >
                Complete Trade
                <span
                  className={cn(
                    "flex gap-1 ml-2 items-center",
                    totalSale < 0 ? "text-red-400" : "text-green-400"
                  )}
                >
                  <CoinsIcon size={14} />
                  {totalSale}
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedToBuy([]);
                  setSelectedToSell([]);
                }}
                disabled={isTrading}
              >
                Cancel Trade
              </Button>
            </div>
          )}
          <TypographyP>Wares for sale</TypographyP>
          <TypographyMuted>
            Select an item to view it&apos;s cost
          </TypographyMuted>
          <InventoryList
            localStorageKey="useGridView-npc"
            isItemSelected={(item: Item) =>
              !!selectedToBuy.find(
                (value) => value.description === item.description
              )
            }
            inventory={member.inventory || []}
            onClick={(item) => {
              if (
                selectedToBuy.find(
                  (value) => value.description === item.description!
                )
              ) {
                setSelectedToBuy((prev) =>
                  prev.filter((j) => j.description !== item.description!)
                );
              } else {
                setSelectedToBuy((prev) => [...prev, item]);
              }
            }}
          />
          {member.inventory.length === 0 && (
            <div className="flex flex-col items-center justify-center col-span-full">
              <PackageIcon size={32} className="mb-2" />
              <div className="text-sm text-foreground/50">
                No items for sale
              </div>
            </div>
          )}
          Your Inventory
          <TypographyMuted>
            Select an item to view it&apos;s value
          </TypographyMuted>
          <InventoryList
            localStorageKey="useGridView-user"
            isItemSelected={(item: Item) =>
              !!selectedToSell.find(
                (value) => value.description === item.description
              )
            }
            inventory={gameState?.player?.inventory || []}
            onClick={(item) => {
              if (
                selectedToSell.find(
                  (value) => value.description === item.description!
                )
              ) {
                setSelectedToSell((prev) =>
                  prev.filter((j) => j.description !== item.description!)
                );
              } else {
                setSelectedToSell((prev) => [...prev, item]);
              }
            }}
          />
        </SheetBody>
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
