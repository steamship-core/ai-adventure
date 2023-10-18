"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { track } from "@vercel/analytics/react";
import { CompassIcon, MoreHorizontalIcon } from "lucide-react";
import { useRecoilState } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const AdventureHistorySheet = () => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          onClick={(e) => {
            track("Click Button", {
              buttonName: "Adventure History",
              location: "Camp",
            });
          }}
          variant="outline"
          className="w-full flex justify-start"
        >
          <CompassIcon size={16} className="h-4 w-4 md:h-6 md:w-6 mr-2" />
          Past Adventures
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0 overflow-auto"
      >
        <SheetHeader>
          <div className="flex items-center flex-col justify-center">
            Adventure History
            <Player
              autoplay
              src="/book-lottie.json"
              keepLastFrame
              style={{ height: "150px", width: "150px" }}
            />
          </div>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-8">
            {gameState?.quests?.map((quest, i) => {
              if (!quest.text_summary) return null;
              return (
                <a
                  href={`/play/quest/${quest.name}`}
                  key={quest.name}
                  className="relative"
                >
                  <div className="border border-foreground/20 rounded-md p-4">
                    <TypographySmall className="!mt-0">
                      {quest.text_summary}
                    </TypographySmall>
                  </div>
                  <div className="absolute -bottom-4 left-0 w-full flex items-center justify-center">
                    <div>
                      <MoreHorizontalIcon size={16} />
                    </div>
                  </div>
                </a>
              );
            })}
            {gameState?.quests?.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center">
                You haven&apos;t been on any adventures yet.
              </div>
            )}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
