"use client";

import { useEffect } from "react";
import { useAudio } from "react-use";
import { useRecoilState } from "recoil";
import {
  recoilBackgroundAudioState,
  recoilBackgroundAudioUrlState,
  recoilNarrationAudioState,
  recoilNarrationAudioUrlState,
  recoilNarrationBlockIdState,
} from "./recoil-provider";

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export function AudioProvider({ children, ...props }: AudioProviderProps) {
  const [useBackgroundAudio, toggleBackgroundAudio] = useRecoilState(
    recoilBackgroundAudioState
  );
  const [useNarration, toggleNarration] = useRecoilState(
    recoilNarrationAudioState
  );
  const [backgroundAudioUrl, _] = useRecoilState(recoilBackgroundAudioUrlState);
  const [narrationAudioUrl, setNarrationAudioUrl] = useRecoilState(
    recoilNarrationAudioUrlState
  );
  const [narrationBlockId, _2] = useRecoilState(recoilNarrationBlockIdState);

  console.log("Use background", useBackgroundAudio, backgroundAudioUrl);
  console.log("Use narration", useNarration, narrationAudioUrl);

  const [
    backgroundAudio,
    backgroundAudioState,
    backgroundAudioControls,
    backgroundAudioRef,
  ] = useAudio({
    src: backgroundAudioUrl || "",
    autoPlay: useBackgroundAudio == true,
  });

  const [narration, narrationState, narrationControls, narrationRef] = useAudio(
    {
      src: narrationAudioUrl || "",
      autoPlay: useNarration == true,
    }
  );

  useEffect(() => {
    if (backgroundAudioRef && backgroundAudioRef.current) {
      backgroundAudioRef.current?.setAttribute("loop", "true");
    }
  }, [backgroundAudioRef]);

  useEffect(() => {
    if (narrationRef && narrationRef.current) {
      narrationRef.current?.removeAttribute("loop");
    }
  }, [narrationRef]);

  useEffect(() => {
    console.log(
      "Use effect for bg audio",
      backgroundAudioUrl,
      useBackgroundAudio
    );
    if (
      backgroundAudioControls &&
      backgroundAudioRef &&
      backgroundAudioRef.current
    ) {
      if (useBackgroundAudio == true && backgroundAudioUrl) {
        console.log("PLAY Background Audio");
        backgroundAudioControls.play();
      } else {
        backgroundAudioControls.pause();
      }
    }
  }, [
    backgroundAudioRef,
    useBackgroundAudio,
    backgroundAudioUrl,
    backgroundAudioControls,
  ]);

  useEffect(() => {
    if (narrationControls && narrationRef) {
      if (useNarration == true && narrationAudioUrl) {
        narrationControls.play();
      } else {
        narrationControls.pause();
      }
    }
  }, [narrationRef, useNarration, narrationAudioUrl, narrationControls]);

  useEffect(() => {
    if (narrationBlockId) {
      console.log("Will try to narrate block", narrationBlockId);
      // Get the narration audio url from the block id.
      fetch("/api/game/narrate", {
        method: "POST",
        body: JSON.stringify({ block_id: narrationBlockId }),
      }).then(
        async (resp) => {
          console.log("resp", resp);
          const j = await resp.json();
          console.log(j);
          const { url } = j;
          setNarrationAudioUrl(url);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setNarrationAudioUrl(undefined);
    }
  }, [narrationBlockId, setNarrationAudioUrl]);

  return (
    <>
      {children} {backgroundAudio} {narration}
    </>
  );
}
