"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const CreationContainer = ({ children }: { children: ReactNode }) => (
  <main className="h-[100dvh] flex flex-col-reverse overflow-y-auto max-w-2xl mx-auto px-6 py-6 lg:px-24 gap-12 ">
    {children}
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
