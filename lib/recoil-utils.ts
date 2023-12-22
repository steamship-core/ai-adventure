"use client";

import { recoilGameState } from "@/components/providers/recoil";
import { RecoilState, useRecoilState } from "recoil";
import { getGameState } from "./game/game-state.client";
import { GameState } from "./game/schema/game_state";

export function useRecoilCounter(
  recoilState: RecoilState<Record<string, boolean>>
): {
  count: number;
  streamStart: (id: string) => void;
  streamEnd: (id: string) => void;
  isStreaming: (id: string) => boolean;
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
  const isStreaming = (id: string) => {
    return streamers[id] || false;
  };

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
    isStreaming,
  };
}

export function useGameState(handle: string): {
  gameState: GameState;
  setGameState: (gs: GameState) => void;
  refreshGameState: () => Promise<void>;
} {
  const [gameState, setGameState] = useRecoilState(recoilGameState);

  const refreshGameState = async () => {
    const gs = await getGameState(handle);
    setGameState(gs);
  };

  return {
    gameState,
    setGameState,
    refreshGameState,
  };
}
