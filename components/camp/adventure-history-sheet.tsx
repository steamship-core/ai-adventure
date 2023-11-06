"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { track } from "@vercel/analytics/react";
import { CompassIcon, MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const AdventureHistorySheet = () => {
  const gameState = useRecoilValue(recoilGameState);
  const params = useParams();
  const questArcs = gameState?.quest_arc || [];
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
          Past Quests
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0 overflow-auto"
      >
        <SheetHeader>
          <div className="flex items-center flex-col justify-center">
            Quest History
            <TypographyMuted>
              See all the quests you&apos;ve completed
            </TypographyMuted>
            <Player
              autoplay
              src="/book-lottie.json"
              keepLastFrame
              style={{ height: "150px", width: "150px" }}
            />
          </div>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-8 h-full">
            {gameState?.quests?.map((quest, i) => {
              if (quest.name === gameState?.current_quest) {
                return null;
              }
              const questArc = i < questArcs.length ? questArcs[i] : null;
              return (
                <a
                  href={`/play/${params.handle}/quest/${quest.name}`}
                  key={quest.name}
                  className="relative"
                >
                  <div className="border border-foreground/20 rounded-md p-4 hover:border-indigo-400">
                    {questArc && (
                      <div className="flex flex-col">
                        <TypographyLarge>{questArc.location}</TypographyLarge>
                        <TypographySmall className="mt-2 leading-1">
                          {questArc.goal}
                        </TypographySmall>
                      </div>
                    )}
                    <TypographyMuted className="mt-2">
                      {quest.text_summary}
                    </TypographyMuted>
                    <TypographyMuted className="mt-2 text-muted-foreground">
                      Items Earned
                    </TypographyMuted>
                    {quest.new_items?.map((item) => (
                      <div key={item.id}>
                        <TypographySmall className="mt-2">
                          {item.name}
                        </TypographySmall>
                        {item.picture_url && (
                          <div>
                            <div>
                              <Image
                                src={item.picture_url}
                                width={128}
                                height={128}
                                alt={item.name!}
                                className="overflow-hidden rounded-md"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
                You haven&apos;t been on any quests yet.
              </div>
            )}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
