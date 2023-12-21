"use client";

import { useBackgroundMusic, useDebugModeSetting } from "@/lib/hooks";
import { SignOutButton } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { FlameIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilEnergyState, recoilGameState } from "../providers/recoil";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Switch } from "../ui/switch";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographySmall } from "../ui/typography/TypographySmall";

export const CharacterSheet = ({
  mini,
  workspaceHandle = "",
  gameEngineVersion = "",
  title, // Default: character name and rank
  subtitle, // Default: character energy level
  className = "",
}: {
  title?: string;
  subtitle?: string;
  mini?: boolean;
  gameEngineVersion?: string;
  workspaceHandle?: string;
  className?: string;
}) => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);
  const energy = useRecoilValue(recoilEnergyState);

  const [isDebugMode, setIsDebugMode] = useDebugModeSetting();
  const { push } = useRouter();
  const params = useParams();
  const {
    isOffered: backgroundAudioOffered,
    setIsOffered: setBackgroundAudioOffered,
  } = useBackgroundMusic();

  const setEnergyTo100 = async () => {
    const response = await fetch(`/api/game/debug`, {
      method: "POST",
      body: JSON.stringify({
        operation: "top-up-energy",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      let newGameState = await response.json();
      setGameState(newGameState);
    }
  };

  const dumpGameState = async () => {
    const response = await fetch(`/api/game/${params.handle}/debug`, {
      method: "POST",
      body: JSON.stringify({
        operation: "dump-state",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      let output = await response.json();
      console.log(output);
    }
  };

  const visitSteamshipConsole = async () => {
    const response = await fetch(`/api/game/${params.handle}/debug`, {
      method: "POST",
      body: JSON.stringify({
        operation: "dump-state",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      let output = await response.json();
      let agentUrl = output.agentUrl;
      let parts = agentUrl.split("//");
      let path = parts[1].split("/");
      let workspace = path[1];
      window.location.href = `https://steamship.com/dashboard/agents/workspaces/${workspace}`;
    }
  };

  const setEnergyTo0 = async () => {
    const response = await fetch(`/api/game/debug`, {
      method: "POST",
      body: JSON.stringify({
        operation: "deplete-energy",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      let newGameState = await response.json();
      setGameState(newGameState);
    }
  };

  const buyEnergy = async () => {
    push("/account/plan");
  };
  const queryClient = useQueryClient();

  const resetCharacter = async () => {
    const response = await fetch(`/api/game/${params.handle}/debug`, {
      method: "POST",
      body: JSON.stringify({
        operation: "reset",
      }),
    });
    if (!response.ok) {
      console.error(response);
    } else {
      await queryClient.invalidateQueries();
      push("/");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {mini === true ? (
          <button className="text-left h-full">
            <div className="rounded-lg overflow-hidden h-10 w-10 md:h-18 md:w-18 border border-foregound">
              <Image
                src={gameState?.profile_image_url}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
          </button>
        ) : (
          <button
            className={`flex gap-4 text-left h-full items-center ${className}`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="rounded-lg overflow-hidden h-10 w-10 md:h-18 md:w-18 border border-foregound">
                <Image
                  src={gameState?.profile_image_url}
                  height={1024}
                  width={1024}
                  alt="Character"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              {title ? (
                <TypographySmall className="text-xs whitespace-nowrap overflow-ellipsis">
                  {title}
                </TypographySmall>
              ) : (
                <TypographyLarge className="text-sm md:text-lg flex flex-col whitespace-nowrap overflow-ellipsis w-full">
                  <span>{gameState?.player?.name}</span>
                </TypographyLarge>
              )}
              {subtitle && (
                <TypographyMuted className="text-xs whitespace-nowrap overflow-ellipsis">
                  {subtitle}
                </TypographyMuted>
              )}
            </div>
          </button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-4 md:max-w-6xl md:mx-auto">
          <div className="flex items-center justify-center flex-col w-full gap-2 relative">
            <TypographyH1>{gameState?.player?.name}</TypographyH1>
            <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
              <Image
                src={gameState?.profile_image_url}
                height={1024}
                width={1024}
                alt={gameState?.player?.name}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <Dialog>
                <DialogTrigger>
                  <TypographyP className="flex items-center">
                    <FlameIcon size={20} className="mr-2 text-orange-400" />
                    {energy || 0}
                  </TypographyP>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center">
                      Energy
                    </DialogTitle>
                    <DialogDescription>
                      Looking to purchase more energy? Click below to visit the
                      energy store.
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    asChild
                    className="bg-orange-600 text-white hover:bg-orange-700"
                  >
                    <Link href="/account/plan">
                      Purchase Energy <FlameIcon className="ml-2" />
                    </Link>
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <TypographyH3>Background</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.background}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Description</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.description}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Stats</TypographyH3>
              <ul className="flex flex-col gap-2 list-disc pl-6">
                <li>
                  <TypographyMuted>
                    {gameState?.current_quest
                      ? gameState?.quests?.length - 1
                      : gameState?.quests?.length}{" "}
                    quests completed
                  </TypographyMuted>
                </li>
                <li>
                  <TypographyMuted>
                    {gameState?.player?.inventory?.length} items found
                  </TypographyMuted>
                </li>
              </ul>
            </div>
            <div>
              <TypographyH3>Audio</TypographyH3>
              <TypographyMuted>Offer Background Music</TypographyMuted>
              <Switch
                checked={backgroundAudioOffered === true}
                onCheckedChange={setBackgroundAudioOffered as any}
              />
            </div>
            <div>
              <TypographyH3>Account</TypographyH3>
              <TypographyMuted>Show Debug Information</TypographyMuted>
              <Switch
                checked={isDebugMode === true}
                onCheckedChange={setIsDebugMode as any}
              />
              <div className="flex gap-4 flex-wrap my-4">
                <Button
                  onClick={(e) => {
                    buyEnergy();
                  }}
                >
                  Buy Energy
                </Button>

                {process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_TOPUP === "true" && (
                  <Button
                    onClick={(e) => {
                      setEnergyTo0();
                    }}
                  >
                    Set Energy to 0
                  </Button>
                )}

                {process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_TOPUP === "true" && (
                  <Button
                    onClick={(e) => {
                      setEnergyTo100();
                    }}
                  >
                    Set Energy to 100
                  </Button>
                )}

                {process.env.NEXT_PUBLIC_OFFER_STATE_DUMP === "true" && (
                  <Button
                    onClick={(e) => {
                      dumpGameState();
                    }}
                  >
                    Dump GameState log
                  </Button>
                )}

                {process.env.NEXT_PUBLIC_OFFER_STATE_DUMP === "true" && (
                  <Button
                    onClick={(e) => {
                      visitSteamshipConsole();
                    }}
                  >
                    Visit Steamship Console
                  </Button>
                )}

                <Button
                  onClick={(e) => {
                    resetCharacter();
                  }}
                >
                  Reset Character
                </Button>
              </div>
            </div>
          </div>
          <div>
            <TypographyH3>Diagnostics</TypographyH3>
            <TypographyMuted>Game Engine</TypographyMuted>
            <TypographyMuted>{gameEngineVersion || "None"}</TypographyMuted>
            <TypographyMuted>Workspace</TypographyMuted>
            <TypographyMuted>{workspaceHandle || "None"}</TypographyMuted>
            <TypographyMuted>Agent State</TypographyMuted>
            <TypographyMuted>
              {gameState?.active_mode || "None"}
            </TypographyMuted>
            <TypographyMuted>Current Quest</TypographyMuted>
            <TypographyMuted>
              {gameState?.current_quest || "None"}
            </TypographyMuted>
            <TypographyMuted>Current NPC Conversation</TypographyMuted>
            <TypographyMuted>
              {gameState?.in_conversation_with || "None"}
            </TypographyMuted>
          </div>
          <div>
            <TypographyH3>About this game</TypographyH3>
            <TypographyMuted>
              This game was built using the{" "}
              <a href="https://www.steamship.com/" target="_blank">
                Steamship Agent SDK
              </a>
              . If there is a bug or you have a feature request, please submit
              an issue on Github. If you&apos;re a developer, feel free to fork
              the repo and create your own game!
            </TypographyMuted>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <TypographySmall>Python</TypographySmall>
                <Button asChild>
                  <a
                    href="https://github.com/steamship-core/ai-adventure-agent/tree/main"
                    target="_blank"
                  >
                    <StarIcon
                      className="fill-yellow-600 text-yellow-600 mr-2"
                      size={20}
                    />
                    Agent Repo
                  </a>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <TypographySmall>Next.js</TypographySmall>
                <Button asChild>
                  <a
                    href="https://github.com/steamship-core/ai-adventure"
                    target="_blank"
                  >
                    <StarIcon
                      className="fill-yellow-600 text-yellow-600 mr-2"
                      size={20}
                    />
                    Web Repo
                  </a>
                </Button>
              </div>
            </div>
            <SignOutButton>
              <Button variant="outline" className="mt-4 w-full">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
