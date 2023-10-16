"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { ReactNode } from "react";
import { RecoilRoot, SetRecoilState, atom } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    console.log("localStorageEffect", key);
    if (typeof window === "undefined" || window?.localStorage === undefined) {
      return;
    }

    const savedValue = localStorage.getItem(key);
    console.log("localStorageEffect savedValue", savedValue);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: any, _: any, isReset: any) => {
      console.log("localStorageEffect isReset", key);
      console.log("localStorageEffect isReset", isReset);
      console.log("localStorageEffect newValue", newValue);

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

export const recoilNarrationAudioState = atom<boolean | undefined>({
  key: "NarrationAudioState",
  default:
    typeof window != "undefined" &&
    window.localStorage &&
    localStorage?.getItem("NarrationAudioState") === "true",
  effects: [localStorageEffect("NarrationAudioState")],
});

export const recoilAudioActiveState = atom<boolean | undefined>({
  key: "AudioActiveState",
  default:
    typeof window != "undefined" &&
    window.localStorage &&
    localStorage?.getItem("AudioActiveState") === "true",
  effects: [localStorageEffect("AudioActiveState")],
});

export const recoilNarrationAudioUrlState = atom<string | undefined>({
  key: "NarrationAudioUrl",
  default: undefined,
});

export const recoilNarrationBlockIdState = atom<string | undefined>({
  key: "NarrationBlockIds",
  default: undefined,
});

function initializeState(
  set: SetRecoilState,
  gameState: GameState,
  backgroundAudioState?: boolean,
  narrationAudioState?: boolean,
  audioActiveState?: boolean,
  backgroundAudioUrl?: string,
  narrationAudioUrl?: string,
  narrationBlockId?: string
) {
  set(recoilGameState, gameState);
  set(recoilNarrationAudioState, narrationAudioState);
  set(recoilBackgroundAudioState, backgroundAudioState);
  set(recoilAudioActiveState, audioActiveState);
  set(recoilBackgroundAudioUrlState, backgroundAudioUrl);
  set(recoilNarrationAudioUrlState, narrationAudioUrl);
  set(recoilNarrationBlockIdState, narrationBlockId);
}

function RecoilProvider({
  children,
  gameState,
  backgroundAudioState,
  narrationAudioState,
  audioActiveState,
  backgroundAudioUrlState,
  narrationAudioUrlState,
  narrationBlockIdState,
}: {
  children: ReactNode;
  gameState: GameState;
  backgroundAudioState?: boolean;
  narrationAudioState?: boolean;
  audioActiveState?: boolean;
  backgroundAudioUrlState?: string;
  narrationAudioUrlState?: string;
  narrationBlockIdState?: string;
}) {
  return (
    <RecoilRoot
      initializeState={({ set }) =>
        initializeState(
          set,
          gameState,
          backgroundAudioState,
          narrationAudioState,
          audioActiveState,
          backgroundAudioUrlState,
          narrationAudioUrlState,
          narrationBlockIdState
        )
      }
    >
      {children}
    </RecoilRoot>
  );
}

export default RecoilProvider;
