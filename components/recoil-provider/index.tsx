"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { ReactNode } from "react";
import { RecoilRoot, SetRecoilState, atom } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any, _: any, isReset: any) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const recoilGameState = atom({
  key: "GameState",
  default: {} as GameState,
});

export const recoilBackgroundAudioState = atom({
  key: "BackgroundAudioState",
  default: false,
  effects: [localStorageEffect("BackgroundAudioState")],
});

export const recoilNarrationAudioState = atom({
  key: "NarrationAudioState",
  default: false,
  effects: [localStorageEffect("NarrationAudioState")],
});

function initializeState(
  set: SetRecoilState,
  gameState: GameState,
  backgroundAudioState: boolean,
  narrationAudioState: boolean
) {
  set(recoilGameState, gameState);
  set(recoilNarrationAudioState, narrationAudioState);
  set(recoilBackgroundAudioState, backgroundAudioState);
}

function RecoilProvider({
  children,
  gameState,
  backgroundAudioState,
  narrationAudioState,
}: {
  children: ReactNode;
  gameState: GameState;
  backgroundAudioState: boolean;
  narrationAudioState: boolean;
}) {
  return (
    <RecoilRoot
      initializeState={({ set }) =>
        initializeState(
          set,
          gameState,
          backgroundAudioState,
          narrationAudioState
        )
      }
    >
      {children}
    </RecoilRoot>
  );
}

export default RecoilProvider;
