import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyMuted({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"p">) {
  return (
    <p {...rest} className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}
