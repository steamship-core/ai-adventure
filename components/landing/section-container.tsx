"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32 mt-16  duration-500 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}
