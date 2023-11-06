"use client";

import { useBackgroundMusic } from "@/lib/hooks";
import AudioPlayer from "./audio-player";

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export default function BackgroundAudio() {
  const { isActive, isOffered, url } = useBackgroundMusic();
  if (isOffered) {
    return <AudioPlayer active={isActive} url={url as string} loop={true} />;
  }
  return null;
}
