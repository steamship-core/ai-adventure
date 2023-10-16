import { Item } from "@/lib/game/schema/objects";
import { cn } from "@/lib/utils";
import { CheckIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Switch } from "./ui/switch";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { TypographyMuted } from "./ui/typography/TypographyMuted";

export const InventoryList = ({
  inventory,
  onClick,
  isItemSelected,
  localStorageKey = "useGridView",
}: {
  inventory: Item[];
  onClick?: (item: Item) => void;
  isItemSelected?: (item: Item) => boolean;
  localStorageKey?: string;
}) => {
  const [useGridView, setUseGridView] = useState(false);

  useEffect(() => {
    const preference = localStorage.getItem(localStorageKey);
    if (preference) {
      setUseGridView(JSON.parse(preference));
    }
  }, [localStorageKey, useGridView]);

  const toggleGridView = (checked: boolean) => {
    setUseGridView(checked);
    localStorage?.setItem(localStorageKey, checked.toString());
  };

  if (useGridView) {
    return (
      <>
        <Switch checked={useGridView} onCheckedChange={toggleGridView} />

        <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
          {inventory?.map((item, i) => (
            <div key={item.name} className="flex items-center justify-center">
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
      </>
    );
  }

  return (
    <>
      <Switch checked={useGridView} onCheckedChange={toggleGridView} />

      <div className="flex w-full overflow-hidden">
        <div className="w-full flex flex-col gap-5 mt-8 pb-8">
          {inventory.map((item, i) => (
            <div key={item.description} className="flex gap-2 text-left w-full">
              <div>
                <button
                  className={cn(
                    "border rounded-md h-12 aspect-square relative overflow-hidden",
                    !onClick && "hover:cursor-default"
                  )}
                  onClick={() => {
                    onClick && onClick(item);
                  }}
                >
                  <Image
                    src={"/orb.png"}
                    fill
                    alt={item.description!}
                    className="object-cover"
                  />
                  {isItemSelected?.(item) && (
                    <div className="absolute top-0 left-0 bg-background/50 w-full h-full z-20 flex items-center justify-center">
                      <CheckIcon size={32} />
                    </div>
                  )}
                </button>
              </div>
              <div className="w-full">
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.name!} className="border-none">
                    <AccordionTrigger className="w-full p-0">
                      <div className="flex flex-col w-full text-left">
                        <TypographyLarge>{item.name}</TypographyLarge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div>
                        <TypographyMuted>
                          {item.description ||
                            `No description can be found for this item. It's purpose has been lost to time.`}
                        </TypographyMuted>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
