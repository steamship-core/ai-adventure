"use client";

import { RecoilState, useRecoilState } from "recoil";

export function useRecoilCounter(
  recoilState: RecoilState<Record<string, boolean>>
): {
  count: number;
  streamStart: (id: string) => void;
  streamEnd: (id: string) => void;
} {
  const [streamers, setStreamers] = useRecoilState(recoilState);

  const streamStart = (id: string) =>
    setStreamers((prev: Record<string, boolean>) => {
      return { ...prev, ...{ id: true } };
    });
  const streamEnd = (id: string) =>
    setStreamers((prev: Record<string, boolean>) => {
      return { ...prev, ...{ id: false } };
    });

  let count = 0;
  for (let key in streamers) {
    if (streamers[key] == true) {
      count++;
    }
  }

  return {
    count,
    streamStart,
    streamEnd,
  };
}
