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

const InventorySheet = ({ buttonText }: { buttonText: string }) => (
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
      <div className="flex w-full overflow-hidden">
        <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <div className="border rounded-md border-foreground/20 h-12 aspect-square" />
            </div>
          ))}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default InventorySheet;
