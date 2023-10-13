import Steamship from "@/lib/streaming-client/src";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSteamshipClient() {
  return new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    appBase: process.env.STEAMSHIP_APP_BASE,
    apiBase: process.env.STEAMSHIP_API_BASE,
  });
}

/**
 * Return a Steamship-friendly handle map from a Clerk ID.
 *
 * Replace all uppercase letters X with "-x". That way guaranteed uniqueness is preserved.
 * @param userId
 * @returns
 */
export function clerkIdToSteamshipHandle(userId: string) {
  // For DNS reasons, we don't allow uppercase.
  var ret = "";
  for (let i = 0; i < userId.length; i++) {
    let lc = userId[i].toLocaleLowerCase();
    if (userId[i] != lc) {
      ret += `-${lc}`;
    } else {
      ret += userId[i];
    }
  }
  return ret;
}
