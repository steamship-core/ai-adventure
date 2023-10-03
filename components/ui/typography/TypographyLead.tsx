import { cn } from "@/lib/utils"
import { ReactNode } from 'react';

export function TypographyLead({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p {...rest} className={cn('text-xl text-muted-foreground', className)}>
      {children}
    </p>
  );
}
