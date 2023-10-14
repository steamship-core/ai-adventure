import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH1({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...rest}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
