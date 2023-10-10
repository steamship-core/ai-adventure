import Steamship from "@steamship/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSteamshipClient(apiBase: string) {
  return new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    apiBase,
  });
}
