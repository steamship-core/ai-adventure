"use client";

import { cn } from "@/lib/utils";
import { Volume2Icon } from "lucide-react";
import { useRecoilState } from "recoil";
import {
  recoilBackgroundAudioState,
  recoilNarrationAudioState,
} from "./recoil-provider";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Switch } from "./ui/switch";
import { TypographyMuted } from "./ui/typography/TypographyMuted";

const AudioSheet = ({ text = "Audio Settings" }: { text?: string }) => {
  const [useBackgroundAudio, toggleBackgroundAudio] = useRecoilState(
    recoilBackgroundAudioState
  );
  const [useNarration, toggleNarration] = useRecoilState(
    recoilNarrationAudioState
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Volume2Icon size={16} className={cn(text && "mr-2")} />
          {text}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-100% h-[100dvh] flex flex-col pb-0"
      >
        <SheetHeader>
          <SheetTitle>Audio Settings</SheetTitle>
        </SheetHeader>
        <TypographyMuted>Play Background Music</TypographyMuted>
        <Switch
          checked={useBackgroundAudio === true}
          onCheckedChange={toggleBackgroundAudio as any}
        />
        <TypographyMuted>Play Narrations</TypographyMuted>
        <Switch
          checked={useNarration === true}
          onCheckedChange={toggleNarration as any}
        />
        <br />
      </SheetContent>
    </Sheet>
  );
};

export default AudioSheet;
