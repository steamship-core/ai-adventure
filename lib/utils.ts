import Steamship from "@/lib/streaming-client/src";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSteamshipClient() {
  return new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    appBase: process.env.NEXT_PUBLIC_STEAMSHIP_APP_BASE,
    apiBase: process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE,
  });
}
