"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "../shared/end-sheet";
import { useEffect, useRef } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { NarrativeBlock } from "./narrrative-block";
import { Block } from "@/lib/streaming-client/src";

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: () => void;
  isComplete: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { questId } = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: { context_id: questId },
      id,
      initialInput: "Start a Quest",
    });

  useEffect(() => {
    // Manually submit a message of   "Let's go on an adventure!" when the quest narrative loads
    inputRef?.current?.form?.requestSubmit();
  }, []);

  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages
            .map((message, i) => {
              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="px-4 py-2 border-l-2 border-foreground/20 text-muted-foreground"
                  >
                    {message.content}
                  </div>
                );
              }
              return (
                <NarrativeBlock
                  key={message.id}
                  message={message}
                  onSummary={onSummary}
                  onComplete={onComplete}
                />
              );
            })
            .reverse()}
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end flex-col w-full gap-2 basis-1/12 pb-4 pt-1 relative">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full animate-spin border-2 border-dashed border-green-500 border-t-transparent"></div>
          </div>
        )}
        {isComplete ? (
          <EndSheet isEnd={true} summary={summary} />
        ) : (
          <form
            className="flex gap-2 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inputRef?.current?.focus();
              handleSubmit(e);
            }}
          >
            <Input
              className="w-full"
              value={input}
              onChange={handleInputChange}
              ref={inputRef}
              disabled={isLoading || isComplete}
            />
            <Button type="submit" disabled={isLoading || isComplete}>
              <SendIcon size={16} />
            </Button>
          </form>
        )}
      </div>
    </>
  );
}

/*
* Existing chat widget
* When encountering a new block, may be a chat block or may not be
* Need a getBlockType helper to look through all tags and determine block

Block Types
* new background
* background audio
* narration (of a text block you already have!)
* character image
* Anything else, if it’s role assistant should be shown as text
*/
