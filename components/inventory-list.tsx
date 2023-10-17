import { Item } from "@/lib/game/schema/objects";
import { cn } from "@/lib/utils";
import { CheckIcon, InfoIcon, PackageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TypographyLarge } from "./ui/typography/TypographyLarge";
import { TypographyMuted } from "./ui/typography/TypographyMuted";
import { TypographySmall } from "./ui/typography/TypographySmall";

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
        {/* <Switch checked={useGridView} onCheckedChange={toggleGridView} /> */}

        <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-auto">
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
      {/* <Switch checked={useGridView} onCheckedChange={toggleGridView} /> */}

      <div className="flex w-full overflow-hidden">
        <div className="w-full flex gap-5 mt-8 pb-8 flex-wrap">
          {inventory.map((item, i) => (
            <div
              key={item.description}
              className="flex gap-2 flex-col items-center justify-center"
            >
              <button
                className={cn(
                  "border rounded-md h-32 aspect-square relative overflow-hidden",
                  !onClick && "hover:cursor-default"
                )}
                onClick={() => {
                  onClick && onClick(item);
                }}
              >
                <img
                  src={item?.picture_url}
                  alt={item.description!}
                  className="object-cover -z-10"
                />
                {isItemSelected?.(item) && (
                  <div className="absolute top-0 left-0 bg-blue-600/50 w-full h-full z-20 flex items-center justify-center">
                    <CheckIcon size={32} />
                  </div>
                )}
              </button>
              <div className="w-32">
                <TypographySmall>{item.name}</TypographySmall>
                <Popover>
                  <PopoverTrigger>
                    <InfoIcon size={16} className="ml-2" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <TypographySmall>{item.description}</TypographySmall>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
          {inventory.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center">
              There&apos;s nothing here ... yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
