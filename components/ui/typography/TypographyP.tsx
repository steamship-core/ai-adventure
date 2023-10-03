import { cn } from "@/lib/utils"
import { ReactNode } from 'react';

export function TypographyP({
  children,
  className,
  inverted,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
} & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...rest}
      className={cn(
        'leading-7 [&:not(:first-child)]:mt-6',
        className,
        inverted && 'text-primary-foreground dark:text-primary'
      )}
    >
      {children}
    </p>
  );
}
