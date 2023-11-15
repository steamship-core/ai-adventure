import * as React from "react";

import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { inputClassNames } from "./input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isLoadingMagic?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isLoadingMagic, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-0.5 w-full flex min-h-[80px]",
          isLoadingMagic &&
            "animate-border inline-block rounded-lg from-pink-500 via-red-500 to-yellow-500 bg-[length:_400%_400%] [animation-duration:_2s] bg-gradient-to-r "
        )}
      >
        <div className="bg-background rounded-md flex w-full">
          <textarea
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, isLoadingMagic, ...props }, ref) => {
  return (
    <div
      className={cn(
        "p-0.5 w-full flex",
        isLoadingMagic &&
          "animate-border inline-block rounded-lg from-pink-500 via-red-500 to-yellow-500 bg-[length:_400%_400%] [animation-duration:_2s] bg-gradient-to-r "
      )}
    >
      <div className="bg-background rounded-md flex w-full">
        {/* @ts-ignore */}
        <TextareaAutosize
          className={cn(
            inputClassNames,
            "w-full py-[.6rem] resize-none disabled:cursor-default"
          )}
          maxRows={8}
          {...props}
        />
      </div>
    </div>
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export { Textarea };
