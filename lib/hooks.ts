"use client";

import {
  recoilAudioActiveState,
  recoilBackgroundAudioOfferedState,
  recoilBackgroundAudioUrlState,
  recoilGameState,
} from "@/components/providers/recoil";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export const _useLocalstoreBoolean = (key: string) => {
  const [value, _setValue] = useState<boolean>(false);

  useEffect(() => {
    const preference = localStorage.getItem(key);
    if (preference) {
      _setValue(true);
    }
  }, []);

  const setValue = (isEnabled: boolean) => {
    if (!(isEnabled === true)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, "true");
    }
    _setValue(isEnabled === true);
  };

  return [value, setValue];
};

export const useDebugModeSetting = () => {
  return _useLocalstoreBoolean("showDebugInformation");
};

export const useBackgroundMusic = () => {
  const [isOffered, setIsOffered] = useRecoilState(
    recoilBackgroundAudioOfferedState
  );
  const [isActive, setIsActive] = useRecoilState(recoilAudioActiveState);
  const [url, setUrl] = useRecoilState(recoilBackgroundAudioUrlState);
  return {
    isOffered,
    isActive,
    setIsActive,
    setIsOffered,
    url,
    setUrl,
  };
};

export const useCurrentQuestArc = () => {
  const gameState = useRecoilValue(recoilGameState);

  const questArc = gameState?.quest_arc || [];
  const questCount = gameState?.current_quest
    ? gameState?.quests?.length - 1
    : gameState?.quests?.length;

  const currentQuestArc =
    questCount > questArc.length ? null : questArc[questCount];
  return currentQuestArc;
};
