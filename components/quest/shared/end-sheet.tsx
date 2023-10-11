"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { Player } from "@lottiefiles/react-lottie-player";
import { AwardIcon, BadgeDollarSignIcon, PackageIcon } from "lucide-react";
import Link from "next/link";

const EndSheet = ({ isEnd }: { isEnd: boolean }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant={isEnd ? "default" : "ghost"}>End your journey</Button>
    </SheetTrigger>
    <SheetContent
      side="bottom"
      className="w-100% h-[100dvh] flex flex-col pb-0 px-0"
    >
      <SheetHeader className="px-6">
        <SheetTitle>Your Adventure as come to an end</SheetTitle>
        <SheetDescription>
          Great job, adventurer. Time to collect your rewards.
        </SheetDescription>
      </SheetHeader>
      <div className="overflow-scroll w-full px-6">
        <TypographyH1 className="text-center mt-12">
          Quest Completed
        </TypographyH1>
        <div className="flex items-center justify-center my-12 flex-col gap-6">
          <Player
            autoplay
            src="/award-lottie.json"
            keepLastFrame
            style={{ height: "300px", width: "300px" }}
          />
          <TypographyLarge>You did it!</TypographyLarge>
          <div className="flex gap-6">
            <TypographySmall className="flex items-center">
              <BadgeDollarSignIcon size={16} className="mr-2 text-yellow-400" />
              36
            </TypographySmall>
            <TypographySmall className="flex items-center">
              <PackageIcon size={16} className="mr-2 text-blue-400" />4
            </TypographySmall>
          </div>
          <Button asChild>
            <Link href="/play/camp">Back to camp</Link>
          </Button>
        </div>
        <TypographyH3>Journey Overview</TypographyH3>
        <TypographyMuted className="text-lg mb-12">
          You traveled through the forest, and then you went to the mountains.
          Where you found a cave and went inside - only to find a dragon! But
          you defeated the dragon and saved the princess.
        </TypographyMuted>
        <TypographyH3>Items Gained</TypographyH3>
        <div className="flex w-full overflow-hidden">
          <div className="w-full grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-5 mt-8 pb-8 overflow-scroll">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="border rounded-md border-foreground/20 h-12 aspect-square" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default EndSheet;
