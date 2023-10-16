"use client";

import { useBackgroundMusic } from "@/lib/hooks";
import { useEffect } from "react";
import { useAudio } from "react-use";

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export function AudioPlayer({
  allowed = false,
  loop = false,
  url,
}: {
  allowed: boolean;
  url?: string;
  loop?: boolean;
}) {
  const [audio, state, controls, ref] = useAudio({
    src: url || "",
    autoPlay: allowed == true,
  });

  useEffect(() => {
    if (ref && ref.current && loop) {
      ref.current?.setAttribute("loop", "true");
    }
  }, [ref, loop]);

  useEffect(() => {
    if (controls && ref) {
      if (allowed == true && url) {
        controls.play();
      } else {
        controls.pause();
      }
    }
  }, [ref, allowed, url, controls]);

  return audio;
}

export function BackgroundAudio() {
  const [isAllowed, setAllowed, url, setUrl] = useBackgroundMusic();
  return <AudioPlayer allowed={isAllowed === true} url={url} loop={true} />;
}
