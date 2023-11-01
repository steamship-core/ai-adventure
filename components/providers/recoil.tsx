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

export const recoilEnergyState = atom({
  key: "EnergyState",
  default: 0 as number,
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

export const recoilAudioActiveState = atom<boolean>({
  key: "AudioActiveState",
  default: false,
});

export const recoilBlockHistory = atom({
  key: "ChatState",
  default: [] as string[],
});

export const recoilInitialBlock = atom<string | undefined>({
  key: "InitialChatBlock",
});

function initializeState(
  set: SetRecoilState,
  gameState: GameState,
  energyState: number = 0,
  backgroundAudioState?: boolean,
  audioActiveState: boolean = false,
  backgroundAudioUrl?: string
) {
  set(recoilGameState, gameState);
  set(recoilEnergyState, energyState);
  set(recoilBackgroundAudioState, backgroundAudioState);
  set(recoilAudioActiveState, audioActiveState);
  set(recoilBackgroundAudioUrlState, backgroundAudioUrl);
  set(recoilBlockHistory, []);
  set(recoilInitialBlock, undefined);
}

function RecoilProvider({
  children,
  gameState,
  energyState,
  backgroundAudioState,
  audioActiveState,
  backgroundAudioUrlState,
}: {
  children: ReactNode;
  gameState: GameState;
  energyState: number;
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
          energyState,
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
