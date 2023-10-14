import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH2({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...rest}
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}
