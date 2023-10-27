"use client";

import { useBackgroundMusic } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Volume2Icon } from "lucide-react";
import { useRecoilState } from "recoil";
import { recoilAudioActiveState } from "../providers/recoil";
import { Button } from "../ui/button";

const BackgroundAudioToggle = ({
  text = "Audio Settings",
}: {
  text?: string;
}) => {
  const [isActive, setActive] = useRecoilState(recoilAudioActiveState);
  const { isAllowed } = useBackgroundMusic();

  const toggle = () => {
    setActive((active) => !active);
  };

  if (!isAllowed) {
    return null;
  }

  return (
    <Button variant={isActive ? undefined : "outline"} onClick={toggle}>
      <Volume2Icon size={16} className={cn(text && "mr-2")} />
      {text}
    </Button>
  );
};

export default BackgroundAudioToggle;
