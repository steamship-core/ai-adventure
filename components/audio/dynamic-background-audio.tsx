"use client";

import dynamic from "next/dynamic";

const BackgroundAudio = dynamic(() => import("./background-audio"), {
  ssr: false,
});

export interface AudioProviderProps {
  children?: React.ReactNode;
}

export function DynamicBackgroundAudio() {
  return <BackgroundAudio />;
}
