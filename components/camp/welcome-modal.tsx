"use client";
import { getGameState } from "@/lib/game/game-state.client";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { StepProps, TooltipRenderProps } from "react-joyride";
import { useRecoilValue } from "recoil";
import { recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });
const joyrideSteps: StepProps = [
  {
    target: "#stats",
    placement: "bottom",
    title: "Energy & Coins",
    content: (
      <>
        <TypographyMuted className="text-base text-muted-foreground">
          Quests cost energy to embark on. Earn gold by completing quests or
          selling items.
        </TypographyMuted>
      </>
    ),
    disableBeacon: true,
  },
  {
    target: "#camp",
    placement: "bottom",
    title: "Camp",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Every adventurer needs a place to rest. This is your campsite, where you
        trade items you have found with The Merchant, go on quests, view your
        inventory, or browse past quests.
      </TypographyMuted>
    ),
    disableBeacon: true,
  },
  {
    target: "#actions",
    placement: "top",
    title: "Actions",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        This is where you decide what to do next. You can embark on a quest,
        view your inventory, or browse past quests.
      </TypographyMuted>
    ),
    disableBeacon: true,
  },
];

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) => (
  <div
    {...tooltipProps}
    className="bg-foreground text-background p-4 rounded-md flex flex-col gap-2 max-w-xs mx-4"
  >
    <TypographyLarge>{step.title}</TypographyLarge>
    <div className="flex flex-col gap-2">{step.content}</div>
    <div className="flex gap-2 mt-4 justify-end">
      {index > 0 && <Button {...backProps}>Back</Button>}
      {continuous && <Button {...primaryProps}>Next</Button>}
      {!continuous && <Button {...closeProps}>Close</Button>}
    </div>
  </div>
);

export const WelcomeModal = () => {
  const gameState = useRecoilValue(recoilGameState);
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [runTour, setRunTour] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const loadProfilePic = async () => {
      setImageLoaded(false);
      const gs = await getGameState();
      if (gs && gs.profile_image_url) {
        setProfilePic(gs.profile_image_url);
        setImageLoaded(true);
      }
    };
    const interval = setInterval(() => {
      if (profilePic) return;
      loadProfilePic();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [profilePic, isOpen]);

  useEffect(() => {
    if (gameState?.quests?.length > 0) {
      return;
    }
    // Check if the user has already seen this modal.
    const welcomeModalSeen = localStorage.getItem("welcomeModalSeen");
    if (!welcomeModalSeen) {
      setIsOpen(true);
      localStorage.setItem("welcomeModalSeen", "true");
    }
  }, [gameState?.quests?.length]);

  const closeDialog = () => {
    setIsOpen(false);
    setRunTour(true);
  };
  const [isClamped, setIsClamped] = useState(true);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => closeDialog()}>
        <SheetContent side="bottom" className="w-100% h-[100dvh] flex flex-col">
          <SheetHeader>
            <SheetTitle>Welcome to AI Adventure!</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <div className="flex flex-col gap-4">
              <div className="flex items-center flex-col justify-center">
                <div className="w-full flex items-center flex-col justify-center p-4 border border-foreground/20 rounded-md shadow-lg dark:bg-black bg-white">
                  <TypographyLarge>{gameState?.player?.name}</TypographyLarge>
                  <button onClick={() => setIsClamped((p) => !p)}>
                    <TypographyMuted
                      className={cn(isClamped && "line-clamp-2")}
                    >
                      {gameState?.player?.background}
                    </TypographyMuted>
                  </button>
                  <div className="mt-2">
                    {imageLoaded && profilePic ? (
                      <Image
                        className="w-24 h-24 rounded-full"
                        src={profilePic}
                        alt="Generated profile pic"
                        height={1024}
                        width={1024}
                      />
                    ) : (
                      <Skeleton className="w-24 h-24 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
              <TypographyMuted className="text-base">
                AI Adventure is a open-ended adventure game where everything is
                generated by AI and powered by{" "}
                <a
                  className="text-blue-500"
                  href="https://www.steamship.com/"
                  target="_blank"
                >
                  Steamship
                </a>
                . Explore your own unique world by going on adventures,
                collecting & trading items, and chatting with NPCs.
              </TypographyMuted>

              <TypographyMuted className="text-base">
                Every story, image, item, and sound is generated by AI. That
                means no two players will have the same experience.
              </TypographyMuted>
              <Button onClick={() => closeDialog()}>Let&apos;s go!</Button>
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>
      <Joyride
        run={runTour}
        steps={joyrideSteps}
        continuous
        showProgress
        hideCloseButton
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            arrowColor: "hsl(var(--foreground))",
          },
        }}
      />
    </>
  );
};
