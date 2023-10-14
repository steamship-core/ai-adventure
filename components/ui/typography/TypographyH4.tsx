import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH4({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      {...rest}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}
