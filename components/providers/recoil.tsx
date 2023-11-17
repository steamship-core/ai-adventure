"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { ReactNode } from "react";
import { RecoilRoot, SetRecoilState, atom } from "recoil";

export type ErrorDetails = {
  message?: string;
  title?: string;
  details?: string;
};

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

export const recoilContinuationState = atom({
  key: "ContinuationState",
  default: false,
});

export const recoilErrorModalState = atom<ErrorDetails | undefined>({
  key: "ErrorModalState",
  default: undefined,
});

const backgroundAudioOfferedBlocked =
  typeof window != "undefined" &&
  window.localStorage &&
  localStorage?.getItem("BackgroundAudioOfferedState") === "false";

const audioActiveDefault = !(
  typeof window != "undefined" &&
  window.localStorage &&
  localStorage?.getItem("AudioActiveState") === "false"
);

export const recoilBackgroundAudioOfferedState = atom<boolean | undefined>({
  key: "BackgroundAudioOfferedState",
  default: !backgroundAudioOfferedBlocked,
  effects: [localStorageEffect("BackgroundAudioOfferedState")],
});

export const recoilBackgroundAudioUrlState = atom<string | undefined>({
  key: "BackgroundAudioUrl",
  default: undefined,
});

export const recoilAudioActiveState = atom<boolean>({
  key: "AudioActiveState",
  default: audioActiveDefault,
  effects: [localStorageEffect("AudioActiveState")],
});

export const recoilBlockHistory = atom({
  key: "ChatState",
  default: [] as string[],
});

export const recoilInitialBlock = atom<string | undefined>({
  key: "InitialChatBlock",
});

export const EditorLayoutImage = {
  UNSET: "UNSET",
  LOADING: "LOADING",
  DEFAULT: "DEFAULT",
} as const;

export const recoilEditorLayoutImage = atom<
  string | keyof typeof EditorLayoutImage
>({
  key: "EditorLayoutImage",
  default: EditorLayoutImage.UNSET,
});

function initializeState(
  set: SetRecoilState,
  gameState: GameState,
  energyState: number = 0,
  backgroundAudioOfferedState?: boolean,
  audioActiveState: boolean = false,
  backgroundAudioUrl?: string,
  editorLayoutImage: string = EditorLayoutImage.UNSET,
  errorModalState?: ErrorDetails
) {
  set(recoilGameState, gameState);
  set(recoilEnergyState, energyState);
  set(recoilBackgroundAudioOfferedState, backgroundAudioOfferedState);
  set(recoilAudioActiveState, audioActiveState);
  set(recoilBackgroundAudioUrlState, backgroundAudioUrl);
  set(recoilBlockHistory, []);
  set(recoilInitialBlock, undefined);
  set(recoilEditorLayoutImage, editorLayoutImage);
  set(recoilErrorModalState, errorModalState);
}

function RecoilProvider({
  children,
  gameState = {} as GameState,
  energyState = 0,
  backgroundAudioOfferedState,
  audioActiveState,
  backgroundAudioUrlState,
  editorLayoutImage,
  errorModalState,
}: {
  children: ReactNode;
  gameState?: GameState;
  energyState?: number;
  backgroundAudioOfferedState?: boolean;
  audioActiveState?: boolean;
  backgroundAudioUrlState?: string;
  editorLayoutImage?: string;
  errorModalState?: ErrorDetails;
}) {
  return (
    <RecoilRoot
      initializeState={({ set }) =>
        initializeState(
          set,
          gameState,
          energyState,
          backgroundAudioOfferedState,
          audioActiveState,
          backgroundAudioUrlState,
          editorLayoutImage,
          errorModalState
        )
      }
    >
      {children}
    </RecoilRoot>
  );
}

export default RecoilProvider;
