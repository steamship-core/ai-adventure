"use client";

import { useBackgroundMusic } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Volume2Icon } from "lucide-react";
import { Button } from "../ui/button";

const BackgroundAudioToggle = ({
  text = "Audio Settings",
}: {
  text?: string;
}) => {
  const { isActive, setIsActive, isOffered, url } = useBackgroundMusic();

  const toggle = () => {
    setIsActive((active) => !active);
  };

  if (!isOffered) {
    return null;
  }

  return (
    <Button
      variant={isActive ? undefined : "outline"}
      onClick={toggle}
      className="px-2 py-1 md:px-3 md:py-3 h-8 md:h-10"
    >
      <Volume2Icon size={16} className={(cn(text && "mr-"), "")} />
      {text}
    </Button>
  );
};

export default BackgroundAudioToggle;
