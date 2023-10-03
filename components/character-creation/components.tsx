"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const CreationContainer = ({ children }: { children: ReactNode }) => (
  <main className="flex h-screen items-center justify-center">
    <div className="flex h-full flex-col-reverse overflow-scroll max-w-2xl mx-auto px-6 py-6 lg:px-24 ">
      {children}
    </div>
  </main>
);

export const CreationContent = ({
  children,
  isCurrent,
  onClick,
}: {
  children: ReactNode;
  isCurrent: boolean;
  onClick?: () => any;
}) => (
  <div
    className={cn(
      "w-full transition-opacity duration-500",
      !isCurrent && "opacity-50"
    )}
    onClick={onClick ? onClick : () => null}
  >
    {children}
  </div>
);

export const CreationActions = ({
  children,
  isFinished,
}: {
  children: ReactNode;
  isFinished: boolean;
}) => (
  <div
    className={cn(
      "w-full mt-6 flex flex-col gap-3 transition-opacity duration-500",
      isFinished ? "opacity-1" : "opacity-0"
    )}
  >
    {children}
  </div>
);

import React, { useState, useEffect } from "react";

export const useTypeWriter = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Typing logic goes here
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }

    if (currentIndex === text.length) {
      const timeout = setTimeout(() => {
        setIsFinished(true);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return { currentText, isFinished };
};
