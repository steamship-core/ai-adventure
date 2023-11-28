"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { inputClassNames } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { track } from "@amplitude/analytics-browser";
import { useQuery } from "@tanstack/react-query";
import {
  LoaderIcon,
  MoveLeft,
  PencilIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
type InteractionOptions = "custom" | "suggest" | "none";

const SuggestionSheet = ({
  setSelectedOption,
  setInput,
  generateSuggestions,
  messageCount,
}: {
  setInput: Dispatch<SetStateAction<string>>;
  setSelectedOption: Dispatch<SetStateAction<InteractionOptions>>;
  generateSuggestions: () => Promise<any>;
  messageCount: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", messageCount],
    queryFn: async () => {
      return generateSuggestions() as Promise<
        string[] | { status: { state: string; statusMessage: string } }
      >;
    },
    refetchOnWindowFocus: false,
  });
  const isObject = !Array.isArray(data) && data;
  const error = isObject && data.status.state === "failed";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex gap-4">
          <SparklesIcon className="h-5" /> Suggest
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          {error ? (
            <Alert>
              <AlertTitle>
                This Adventure does not support suggestions.
              </AlertTitle>
              <AlertDescription>
                You&apos;ll need to type your own message or encourage the
                author to update their adventure.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <SheetTitle>What do you do next?</SheetTitle>
              <SheetDescription>
                Select an option below to continue your quest.
              </SheetDescription>
              {isLoading && (
                <div className="flex flex-col gap-4 max-w-lg h-full">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              {data && Array.isArray(data) && (
                <div className="flex flex-col gap-4 max-w-lg h-full">
                  {data.map((suggestion, i) => (
                    <Button
                      onClick={() => {
                        setInput(suggestion);
                        setSelectedOption("custom");
                      }}
                      key={i}
                      variant="outline"
                      className="h-full"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const InteractionBox = ({
  formRef,
  inputRef,
  handleSubmit,
  scrollToBottom,
  input,
  handleInputChange,
  isLoading,
  isComplete,
  setInput,
  generateSuggestions,
  messageCount,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  scrollToBottom: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  isComplete: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  generateSuggestions: () => Promise<any>;
  messageCount: number;
}) => {
  const [selectedOption, setSelectedOption] =
    useState<InteractionOptions>("none");

  return (
    <div className="flex w-full flex-col">
      {selectedOption !== "none" && !(isLoading || isComplete) && (
        <div className="flex gap-2">
          <button
            className="flex gap-2 items-center text-sm mb-2"
            onClick={() => setSelectedOption("none")}
          >
            <MoveLeft className="h-4" /> View Options
          </button>
        </div>
      )}
      {selectedOption === "none" && (
        <div className="flex w-full gap-2">
          <SuggestionSheet
            setSelectedOption={setSelectedOption}
            setInput={setInput}
            generateSuggestions={generateSuggestions}
            messageCount={messageCount}
          />
          <Button
            variant="outline"
            className="w-full flex gap-4"
            onClick={() => setSelectedOption("custom")}
          >
            <PencilIcon className="h-5" /> Custom
          </Button>
        </div>
      )}
      {selectedOption === "custom" && (
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
      )}
    </div>
  );
};

export default InteractionBox;
