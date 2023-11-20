"use client";

import { Button } from "@/components/ui/button";
import { inputClassNames } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@amplitude/analytics-browser";
import { LoaderIcon, SendIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

const InteractionBox = ({
  formRef,
  inputRef,
  handleSubmit,
  scrollToBottom,
  input,
  handleInputChange,
  isLoading,
  isComplete,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  scrollToBottom: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  isComplete: boolean;
}) => {
  return (
    <form
      ref={formRef}
      className="flex gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inputRef?.current?.focus();
        track("Send Message", {
          location: "Quest",
        });
        handleSubmit(e);
        scrollToBottom();
      }}
    >
      <TextareaAutosize
        className={cn(inputClassNames, "w-full py-[.6rem] resize-none")}
        value={input}
        onChange={handleInputChange}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            formRef?.current?.requestSubmit();
          }
        }}
        disabled={isLoading || isComplete}
      />
      <Button type="submit" disabled={isLoading || isComplete}>
        {isLoading ? (
          <LoaderIcon size={16} className="animate-spin" />
        ) : (
          <SendIcon size={16} />
        )}
      </Button>
    </form>
  );
};

export default InteractionBox;
