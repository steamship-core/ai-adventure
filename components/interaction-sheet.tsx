"use client";
import { getGameState } from "@/lib/game/game-state.client";
import { NpcCharacter } from "@/lib/game/schema/characters";
import { Item } from "@/lib/game/schema/objects";
import { CoinsIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { InventoryList } from "./inventory-list";
import { recoilGameState } from "./recoil-provider";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
    await fetch("/api/game/trade", {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex gap-4 hover:bg-foreground/10 rounded-md">
          <div>
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
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0"
      >
        <SheetHeader>
          <SheetDescription>
            <div className="flex gap-6">
              <div>
                <div className="flex flex-col justify-end items-center relative overflow-hidden h-32 w-32 rounded-md border border-yellow-600/90">
                  <Image
                    src={"/merchant.png"}
                    fill
                    alt="A merchant"
                    className="object-cover z-10"
                  />
                  <TypographySmall className="mt-2 z-20 bg-yellow-600/90 py-1 w-full text-primary">
                    {member.name}
                  </TypographySmall>
                </div>
              </div>
              <div className="text-left">{member.description}</div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="w-full overflow-scroll">
          {(selectedToSell.length > 0 || selectedToBuy.length > 0) && (
            <div className="flex flex-col gap-2 border rounded-md p-4 border-blue-500">
              <div className="flex items-center">
                Your Gold:{" "}
                <CoinsIcon size={16} className="text-yellow-400 ml-4 mr-2" />
                <span className="text-yellow-400">
                  {gameState?.player?.gold}
                </span>
              </div>
              {selectedToSell.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <TypographyP>Items to Sell</TypographyP>
                    <div className="flex items-center gap-2">
                      <CoinsIcon size={16} className="text-yellow-400" />
                      <div className="text-yellow-400">
                        {selectedToSell.reduce((acc, item) => {
                          return acc + 42 * (item.modifier || 1);
                        }, 0)}
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
                        {selectedToBuy.reduce((acc, item) => {
                          return acc + 42 * (item.modifier || 1);
                        }, 0)}
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
              <Button
                onClick={trade}
                isLoading={isTrading}
                disabled={isTrading}
              >
                Complete Trade
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
