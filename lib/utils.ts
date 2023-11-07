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

export function objectEquals(obj1: any, obj2: any): boolean {
  // If objects are not the same type, return false
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  // If objects are both null or undefined, return true
  if (obj1 === null && obj2 === null) {
    return true;
  }
  const obj1nil = obj1 === null || typeof obj1 === "undefined";
  const obj2nil = obj2 === null || typeof obj2 === "undefined";
  if ((!obj1nil && obj2nil) || (obj1nil && !obj2nil)) {
    return false;
  }

  // If objects are both primitive types, compare them directly
  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  }
  // If objects are arrays, compare their elements recursively
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!objectEquals(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }
  // If objects are both objects, compare their properties recursively
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || !objectEquals(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export const emojis = [
  {
    id: 29,
    emoji: "🤣",
  },
  {
    id: 30,
    emoji: "😍",
  },
  {
    id: 31,
    emoji: "😢",
  },
  {
    id: 32,
    emoji: "😎",
  },
  {
    id: 33,
    emoji: "😳",
  },
  {
    id: 34,
    emoji: "😃",
  },
  {
    id: 35,
    emoji: "❤️",
  },
];
