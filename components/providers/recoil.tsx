"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { ReactNode } from "react";
import { RecoilRoot, SetRecoilState, atom } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    if (typeof window === "undefined" || window?.localStorage === undefined) {
      return;
    }

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

export const recoilBackgroundAudioState = atom<boolean | undefined>({
  key: "BackgroundAudioState",
  default:
    typeof window != "undefined" &&
    window.localStorage &&
    localStorage?.getItem("BackgroundAudioState") === "true",
  effects: [localStorageEffect("BackgroundAudioState")],
});

export const recoilBackgroundAudioUrlState = atom<string | undefined>({
  key: "BackgroundAudioUrl",
  default: undefined,
});

export const recoilAudioActiveState = atom<boolean | undefined>({
  key: "AudioActiveState",
  default:
    typeof window != "undefined" &&
    window.localStorage &&
    localStorage?.getItem("AudioActiveState") === "true",
  effects: [localStorageEffect("AudioActiveState")],
});

function initializeState(
  set: SetRecoilState,
  gameState: GameState,
  backgroundAudioState?: boolean,
  audioActiveState?: boolean,
  backgroundAudioUrl?: string
) {
  set(recoilGameState, gameState);
  set(recoilBackgroundAudioState, backgroundAudioState);
  set(recoilAudioActiveState, audioActiveState);
  set(recoilBackgroundAudioUrlState, backgroundAudioUrl);
}

function RecoilProvider({
  children,
  gameState,
  backgroundAudioState,
  audioActiveState,
  backgroundAudioUrlState,
}: {
  children: ReactNode;
  gameState: GameState;
  backgroundAudioState?: boolean;
  audioActiveState?: boolean;
  backgroundAudioUrlState?: string;
}) {
  return (
    <RecoilRoot
      initializeState={({ set }) =>
        initializeState(
          set,
          gameState,
          backgroundAudioState,
          audioActiveState,
          backgroundAudioUrlState
        )
      }
    >
      {children}
    </RecoilRoot>
  );
}

export default RecoilProvider;
