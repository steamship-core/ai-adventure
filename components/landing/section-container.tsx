"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

export default function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32 mt-16  duration-500 transition-all",
        inView ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
