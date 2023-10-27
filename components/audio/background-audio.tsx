"use client";

import { useBackgroundMusic } from "@/lib/hooks";
import { useRecoilState } from "recoil";
import { recoilAudioActiveState } from "../providers/recoil";
import AudioPlayer from "./audio-player";

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export default function BackgroundAudio() {
  const { isAllowed, url } = useBackgroundMusic();
  const [isActive] = useRecoilState(recoilAudioActiveState);
  if (!isAllowed) {
    return null;
  }
  return <AudioPlayer active={isActive} url={url as string} loop={true} />;
}
