import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const ContentBox = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div>
    <div className={cn("bg-background/80 p-2 py-2 rounded-sm", className)}>
      {children}
    </div>
  </div>
);
