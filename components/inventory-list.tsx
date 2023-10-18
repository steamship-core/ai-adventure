import { Item } from "@/lib/game/schema/objects";
import { cn } from "@/lib/utils";
import { CheckIcon, PackageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
  return (
    <>
      <div className="flex w-full overflow-hidden">
        <div className="w-full grid grid-cols-3 gap-3 mt-8 pb-8">
          {inventory.map((item, i) => (
            <div key={item.description} className="flex gap-2 flex-col">
              <button
                className={cn(
                  "border rounded-md w-full aspect-square relative overflow-hidden flex items-center justify-center",
                  !onClick && "hover:cursor-default"
                )}
                onClick={() => {
                  onClick && onClick(item);
                }}
              >
                {item.picture_url ? (
                  <img
                    src={item?.picture_url}
                    alt={item.description!}
                    className="object-cover -z-10"
                  />
                ) : (
                  <PackageIcon size={56} />
                )}
                {isItemSelected?.(item) && (
                  <div className="absolute top-0 left-0 bg-blue-600/50 w-full h-full z-20 flex items-center justify-center">
                    <CheckIcon size={32} />
                  </div>
                )}
              </button>
              <div className="w-full text-left">
                <Popover>
                  <PopoverTrigger>
                    <TypographySmall className="underline text-left items-start flex">
                      {item.name}
                    </TypographySmall>
                  </PopoverTrigger>
                  <PopoverContent>
                    <TypographySmall className="text-xs">
                      {item.description}
                    </TypographySmall>
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
