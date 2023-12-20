import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const GradientText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "bg-gradient-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-transparent",
      className
    )}
  >
    {children}
  </span>
);
