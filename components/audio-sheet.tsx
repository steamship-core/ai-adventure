"use client";

import { cn } from "@/lib/utils";
import { Volume2Icon } from "lucide-react";
import { useRecoilState } from "recoil";
import { recoilAudioActiveState } from "./providers/recoil";
import { Button } from "./ui/button";

const AudioSheet = ({ text = "Audio Settings" }: { text?: string }) => {
  const [active, setActive] = useRecoilState(recoilAudioActiveState);

  const toggle = () => {
    if (active) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  return (
    <Button variant={active ? undefined : "outline"} onClick={toggle}>
      <Volume2Icon size={16} className={cn(text && "mr-2")} />
      {text}
    </Button>
  );
};

export default AudioSheet;
