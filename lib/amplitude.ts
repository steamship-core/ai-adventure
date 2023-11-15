"use client";

import * as amplitudeBrowser from "@amplitude/analytics-browser";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

type Amplitude = typeof amplitudeBrowser;
export let amplitude: Amplitude;

const useAmplitudeInit = () => {
  const { user } = useUser();

  useEffect(() => {
    const initAmplitude = async () => {
      if (!amplitude) {
        amplitude = amplitudeBrowser;
        amplitude.init(AMPLITUDE_API_KEY, undefined, {
          logLevel: amplitude.Types.LogLevel.Warn,
        });
      }
      if (user && amplitude) {
        amplitude.setUserId(user.id);
      }
    };
    initAmplitude();
  }, [user]);
};

export const AmplitudeAnalytics = () => {
  useAmplitudeInit();
  return null;
};
