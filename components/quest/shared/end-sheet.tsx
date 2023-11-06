"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
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
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { Quest } from "@/lib/game/schema/quest";
import { Block } from "@/lib/streaming-client/src";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  BadgeDollarSignIcon,
  Loader2Icon,
  PackageIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ItemsGained = ({
  gameState,
  quest,
}: {
  quest?: Quest;
  gameState: GameState | null;
}) => {
  if (!gameState) {
    return (
      <div className="mt-4">
        <Loader2Icon className="animate-spin" size={30} />
      </div>
    );
  }
  if (!quest || !quest.new_items) {
    return null;
  }

  return (
    <div className="flex w-full mt-6 mb-6">
      {quest.new_items.map((item, i) => (
        <div key={item.description} className="flex flex-col gap-2">
          <div>
            <div className="rounded-md h-32 aspect-square relative overflow-hidden">
              <Image
                height={128}
                width={128}
                src={item?.picture_url!}
                alt={item.description!}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col">
            <TypographyLarge>{item.name}</TypographyLarge>
            <TypographyMuted>{item.description}</TypographyMuted>
          </div>
        </div>
      ))}
    </div>
  );
};

const EndSheet = ({
  isEnd,
  summary,
  completeButtonText = "Complete Quest",
}: {
  isEnd: boolean;
  summary: Block | null;
  completeButtonText?: string;
}) => {
  const params = useParams<{ handle: string; questId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const updateGameState = async () => {
      const gs = await getGameState(params.handle);
      setGameState(gs);
    };
    updateGameState();
  }, []);

  const quest = gameState?.quests?.find((q) => q.name === params.questId);
  const questIndex = gameState?.quests?.findIndex(
    (q) => q.name === params.questId
  );
  const questArcs = gameState?.quest_arc ?? [];
  const questArc =
    questIndex !== undefined && questIndex < questArcs.length
      ? questArcs[questIndex]
      : null;

  // THIS IS THE SHARE PAGE -- THE ACTUAL PAGE WE'RE SHARING

  const sharePage = new URL(
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/share/quest`
  );
  const itemImageUrl =
    quest?.new_items?.[0]?.picture_url ||
    `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/share-card-404.png`;

  sharePage.searchParams.set("itemImage", itemImageUrl);
  sharePage.searchParams.set(
    "title",
    questArc ? questArc.location : `${gameState?.player.name}'s Adventure`
  );
  sharePage.searchParams.set("description", quest?.text_summary || "");
  sharePage.searchParams.set("name", gameState?.player.name || "");
  sharePage.searchParams.set(
    "itemName",
    quest?.new_items?.[0]?.name || "Unknown Item"
  );

  // THIS IS THE TWITTER LINK - THE ACTUAL THING THEY'LL CLICK ON

  const twitterLink = new URL("https://twitter.com/intent/tweet");
  twitterLink.searchParams.set(
    "text",
    quest?.social_media_summary ||
      `🎲 Just completed another quest in #aiadventure. Check it out!`
  );
  twitterLink.searchParams.set("url", sharePage.toString());

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={isEnd ? "default" : "ghost"} className="w-full">
          {completeButtonText}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-100% h-[100dvh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Adventure has come to an end</SheetTitle>
          <SheetDescription>
            Great job, adventurer. Time to collect your rewards.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <TypographyH1 className="text-center mt-4 md:mt-8">
            Quest Completed
          </TypographyH1>
          <div className="flex items-center justify-center my-4 md:my-8 flex-col gap-6">
            <Player
              autoplay
              src="/award-lottie.json"
              keepLastFrame
              className="h-44 w-44"
            />
            <TypographyLarge>You did it!</TypographyLarge>
            <div className="flex gap-6">
              {quest?.gold_delta && (
                <TypographySmall className="flex items-center">
                  <BadgeDollarSignIcon
                    size={16}
                    className="mr-2 text-yellow-400"
                  />
                  {quest?.gold_delta}
                </TypographySmall>
              )}
              {quest?.new_items && (
                <TypographySmall className="flex items-center">
                  <PackageIcon size={16} className="mr-2 text-blue-400" />
                  {quest?.new_items?.length}
                </TypographySmall>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Button asChild>
                <a href={`/play/${params.handle}/camp`}>Back to camp</a>
              </Button>
              <a
                className="bg-[#00aced] hover:bg-[#0084b4] text-white font-bold text-base py-2 px-4 rounded-full flex items-center gap-2 justify-center"
                href={twitterLink.href}
                target="_blank"
              >
                <TwitterIcon size={16} /> Share on Twitter
              </a>
            </div>
          </div>
          <TypographyH3>Journey Overview</TypographyH3>
          <TypographyMuted className="text-base mb-12">
            {summary && summary.text}
          </TypographyMuted>
          <TypographyH3>Items Gained</TypographyH3>
          <ItemsGained gameState={gameState} quest={quest} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};

export default EndSheet;
