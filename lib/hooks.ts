"use client";

import {
  recoilBackgroundAudioState,
  recoilBackgroundAudioUrlState,
} from "@/components/recoil-provider";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

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
  const [isAllowed, setAllowed] = useRecoilState(recoilBackgroundAudioState);
  const [url, setUrl] = useRecoilState(recoilBackgroundAudioUrlState);
  return [isAllowed, setAllowed, url as string, setUrl];
};
