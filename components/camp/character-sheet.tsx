"use client";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { Progress } from "../ui/progress";
import { useState, useEffect } from "react";
import { ActivityIcon, BadgeDollarSignIcon } from "lucide-react";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilGameState } from "../recoil-provider";
import { UserButton } from "@clerk/nextjs";
import { levels } from "@/lib/game/levels";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const CharacterSheet = () => {
  const [gameState, setGameState] = useRecoilState(recoilGameState);

  const rank = gameState?.player?.rank || 0;

  // Begin Debug Information State Management
  const showDebugInformationKey = "showDebugInformation";
  const [showDebugInformation, setShowDebugInformation] = useState(false);
  useEffect(() => {
    const preference = localStorage.getItem(showDebugInformationKey);
    if (preference) {
      setShowDebugInformation(JSON.parse(preference));
    }
  }, [showDebugInformationKey, showDebugInformation]);
  const toggleShowDebugInformation = (checked: boolean) => {
    setShowDebugInformation(checked);
    localStorage.setItem(showDebugInformationKey, checked.toString());
  };
  // End Debug Information State Management

  // Begin Diagnostic Test State Management
  const runDiagnosticTestKey = "runDiagnosticTest";
  const [runDiagnosticTest, setRunDiagnosticTest] = useState("");
  useEffect(() => {
    const preference = localStorage.getItem(runDiagnosticTestKey);
    if (preference) {
      setRunDiagnosticTest(preference);
    }
  }, [runDiagnosticTestKey, runDiagnosticTest]);
  const setAndSaveRunDiagnosticTest = (value: string) => {
    setRunDiagnosticTest(value);
    localStorage.setItem(runDiagnosticTestKey, value);
  };
  // End Diagnostic Test State Management

  const setEnergyTo100 = async () => {
    const response = await fetch("/api/game/debug", {
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

  const getLevel = () => {
    try {
      if (rank === 1) {
        levels[0];
      }
      if (rank >= 100) {
        levels[99];
      }
      return levels[Math.ceil(rank / 4)];
    } catch (e) {
      return "Unknown";
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex gap-4 items-start text-left h-full">
          <div className="flex items-center justify-center h-full">
            <div className="rounded-lg overflow-hidden h-10 w-10 md:h-18 md:w-18 border border-blue-600">
              <Image
                src={"/orc.png"}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
          </div>
          <div className="w-44 lg:w-56">
            <TypographyLarge className="text-sm md:text-lg">
              {gameState?.player?.name}
            </TypographyLarge>
            <Progress
              value={(((rank - 1) % 4) / 4) * 100}
              className="h-2 border border-foreground/20"
            />
            <TypographyMuted className="text-xs md:text-sm ">
              Rank: {getLevel()} ({gameState?.player?.rank})
            </TypographyMuted>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0 overflow-scroll"
      >
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          <div className="flex items-center justify-center flex-col w-full gap-2">
            <TypographyH1>{gameState?.player?.name}</TypographyH1>
            <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
              <Image
                src={"/orc.png"}
                height={1024}
                width={1024}
                alt="Character"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <TypographyP className="flex items-center">
                <ActivityIcon size={20} className="mr-2 text-indigo-400" />
                100/100
              </TypographyP>
              <TypographyP className="flex !mt-0 items-center">
                <BadgeDollarSignIcon
                  size={20}
                  className="mr-2 text-yellow-400"
                />
                {gameState?.player?.gold || 0}
              </TypographyP>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <TypographyH3>Explorer</TypographyH3>
              <div className="w-full">
                <Progress
                  value={33}
                  className="h-2 border border-foreground/20"
                />
              </div>
              <TypographyMuted>4 adventures until next rank</TypographyMuted>
            </div>
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
              <TypographyH3>Motivation</TypographyH3>
              <TypographyMuted className=" whitespace-pre-wrap">
                {gameState?.player?.motivation}
              </TypographyMuted>
            </div>
            <div>
              <TypographyH3>Stats</TypographyH3>
              <ul className="flex flex-col gap-2 list-disc pl-6">
                <li>
                  <TypographyMuted>
                    {gameState?.quests?.length} quests completed
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
              <TypographyH3>Account</TypographyH3>
              <TypographyMuted>Show Debug Information</TypographyMuted>
              <Switch
                checked={showDebugInformation}
                onCheckedChange={toggleShowDebugInformation}
              />
              <TypographyMuted>Run Diagnostic Test</TypographyMuted>
              <Input
                className="w-full disabled:cursor-default"
                placeholder={"knock-knock"}
                value={runDiagnosticTest}
                onChange={(e) => setAndSaveRunDiagnosticTest(e.target.value)}
                disabled={false}
              />
              <Button onClick={(e) => setEnergyTo100}>Set Energy to 100</Button>

              <div className="mt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
          <div>
            <TypographyH3>Diagnostics</TypographyH3>
            <TypographyMuted>Current Quest</TypographyMuted>
            <TypographyMuted>
              {gameState?.current_quest || "None"}
            </TypographyMuted>
            <TypographyMuted>Current NPC Conversation</TypographyMuted>
            <TypographyMuted>
              {gameState?.in_conversation_with || "None"}
            </TypographyMuted>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
