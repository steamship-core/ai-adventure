import { cn } from "@/lib/utils"
import { ReactNode } from 'react';

export function TypographySmall({
  children,
  className,
  inverted = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
} & React.ComponentPropsWithoutRef<'small'>) {
  return (
    <small
      {...rest}
      className={cn(
        'text-sm font-medium leading-none',
        className,
        inverted && 'text-primary-foreground dark:text-primary'
      )}
    >
      {children}
    </small>
  );
}
