"use client";

import { useBackgroundMusic, useNarration } from "@/lib/hooks";
import { useEffect } from "react";
import { useAudio } from "react-use";
import { useRecoilState } from "recoil";
import { recoilAudioActiveState } from "./recoil-provider";

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
  const [active, _] = useRecoilState(recoilAudioActiveState);

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
      if (allowed == true && url && active) {
        controls.play();
      } else {
        controls.pause();
      }
    }
  }, [allowed, url, active]); // NOTE: Adding the audio dependencies here causes an infinite loop!

  return audio;
}

export function BackgroundAudio() {
  const [isAllowed, _1, url, _2] = useBackgroundMusic();
  return (
    <AudioPlayer allowed={isAllowed === true} url={url as string} loop={true} />
  );
}

export function NarrationAudio() {
  const { isAllowed, url } = useNarration();
  return <AudioPlayer allowed={isAllowed === true} url={url} loop={false} />;
}
