"use client";

import { cn } from "@/lib/utils";
import { Volume2Icon } from "lucide-react";
import { useRecoilState } from "recoil";
import { recoilBackgroundAudioState } from "./providers/recoil";
import { Button } from "./ui/button";

const BackgroundAudioToggle = ({
  text = "Audio Settings",
}: {
  text?: string;
}) => {
  const [isAllowed, setAllowed] = useRecoilState(recoilBackgroundAudioState);

  const toggle = () => {
    setAllowed((allowed) => !allowed);
  };

  return (
    <Button variant={isAllowed ? undefined : "outline"} onClick={toggle}>
      <Volume2Icon size={16} className={cn(text && "mr-2")} />
      {text}
    </Button>
  );
};

export default BackgroundAudioToggle;
