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
  agentHandle,
  disabled,
}: {
  setInput: Dispatch<SetStateAction<string>>;
  setSelectedOption: Dispatch<SetStateAction<InteractionOptions>>;
  agentHandle?: string;
  disabled: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const fetchSuggestionsApi = async () => {
    const response = await fetch(`/api/agent/${agentHandle}/suggestAction`, {
      method: "POST",
    });
    const choices = response.json();
    return choices;
  };

  const getSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    const s = (await fetchSuggestionsApi()) as Promise<
      string[] | { status: { state: string; statusMessage: string } }
    >;
    if (Array.isArray(s)) {
      setSuggestions(s);
    } else {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex gap-4"
          disabled={disabled}
          onClick={getSuggestions}
        >
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
            <div className="w-full flex items-center justify-center flex-col">
              <SheetTitle>What do you do next?</SheetTitle>
              <SheetDescription className="mb-8">
                Select an option below to continue your quest.
              </SheetDescription>
              {isLoading && (
                <div className="flex flex-col gap-4 max-w-lg h-full">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              <div className="flex flex-col gap-4 max-w-lg h-full">
                {suggestions.map((suggestion, i) => (
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
            </div>
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
  setInput,
  agentHandle,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  scrollToBottom: () => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  agentHandle?: string;
}) => {
  const [selectedOption, setSelectedOption] =
    useState<InteractionOptions>("none");

  return (
    <div className="flex w-full flex-col">
      {selectedOption !== "none" && !isLoading && (
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
            agentHandle={agentHandle}
            disabled={isLoading}
          />
          <Button
            variant="outline"
            className="w-full flex gap-4"
            onClick={() => setSelectedOption("custom")}
            disabled={isLoading}
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
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" disabled={isLoading}>
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
