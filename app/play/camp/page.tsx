import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { UserButton } from "@clerk/nextjs";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const ContentBox = ({ children }: { children: ReactNode }) => (
  <div>
    <div className="bg-background/50 px-4 py-2 rounded-sm">{children}</div>
  </div>
);

export default function CampPages() {
  return (
    <main className="h-[100dvh] p-2 md:p-6 pt-0 relative">
      <Image
        fill
        sizes="100vw"
        src="/campfire.png"
        alt="background"
        className="object-cover -z-10"
      />
      <div className="h-full flex flex-col">
        <div className="w-full flex items-center justify-end pt-6 pb-2 gap-3">
          <Button variant="link" size="sm" asChild>
            <Link
              target="_blank"
              href="https://github.com/steamship-core/ai-adventure"
            >
              <StarIcon className="w-4 h-4 mr-2" /> Star
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex flex-col flex-grow justify-between">
          <ContentBox>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="rounded-full overflow-hidden h-8 w-8 md:h-18 md:w-18 border border-yellow-600 shadow-sm shadow-primary">
                  <Image
                    src={"/orc.png"}
                    height={1024}
                    width={1024}
                    alt="Character"
                  />
                </div>
                <div className="w-28 sm:w-44 lg:w-56">
                  <TypographyLarge>Sir Orc</TypographyLarge>
                  <Progress
                    value={33}
                    className="h-2 border border-foreground/20"
                  />
                  <TypographyMuted>Explorer</TypographyMuted>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <TypographySmall>Energy: 100/100</TypographySmall>
                <TypographySmall>Gold: 100</TypographySmall>
              </div>
            </div>
          </ContentBox>
          <ContentBox>
            <div className="flex flex-col gap-2">
              <Button>Go on an adventure</Button>
              <Button>Send on an adventure</Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>View Inventory</Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="w-100% h-[100dvh] flex flex-col pb-0"
                >
                  <SheetHeader>
                    <SheetTitle>Inventory</SheetTitle>
                    <SheetDescription>
                      Items you&apos;e collected on your adventures. They might
                      just be junk, or they might be useful.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex w-full overflow-hidden">
                    <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center"
                        >
                          <div className="border rounded-md border-foreground/20 h-12 aspect-square" />
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </ContentBox>
        </div>
      </div>
    </main>
  );
}
