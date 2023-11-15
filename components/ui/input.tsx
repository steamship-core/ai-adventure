import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoadingMagic?: boolean;
}

export const inputClassNames =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const checkboxRadioClassNames =
  "inline h-4 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, name, type, isLoadingMagic, ...props }, ref) => {
    const classNames =
      type === "checkbox"
        ? checkboxRadioClassNames
        : type === "radio"
        ? checkboxRadioClassNames
        : inputClassNames;
    return (
      <div
        className={cn(
          "p-0.5 w-full",
          isLoadingMagic &&
            "animate-border inline-block rounded-lg from-pink-500 via-red-500 to-yellow-500 bg-[length:_400%_400%] [animation-duration:_1s] bg-gradient-to-r "
        )}
      >
        <div className="bg-background rounded-md w-full">
          <input
            type={type}
            id={id}
            name={name}
            className={cn(classNames, className)}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
