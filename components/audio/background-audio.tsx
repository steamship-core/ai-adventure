"use client";

import { amplitude } from "@/lib/amplitude";
import { useBackgroundMusic } from "@/lib/hooks";
import { useEffect } from "react";
import AudioPlayer from "./audio-player";

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export default function BackgroundAudio() {
  const { isActive, isOffered, url } = useBackgroundMusic();

  useEffect(() => {
    amplitude.track("Background Audio", {
      isEnabled: isOffered,
    });
  }, [isOffered]);
  if (isOffered) {
    return (
      <AudioPlayer
        active={isActive}
        url={url as string}
        loop={true}
        volume={0.6}
      />
    );
  }
  return null;
}
