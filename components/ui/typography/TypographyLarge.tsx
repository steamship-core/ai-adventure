import { cn } from "@/lib/utils"
import { ReactNode } from 'react';

export function TypographyLarge({
  children,
  className,
  inverted = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  inverted?: boolean;
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...rest}
      className={cn(
        'text-lg font-semibold',
        className,
        inverted && 'text-primary-foreground dark:text-primary'
      )}
    >
      {children}
    </div>
  );
}
