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

export default function QuestNarrative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { questId } = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: { context_id: questId },
      id: questId as string,
      initialInput: "Let's go on an adventure!",
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
              return <NarrativeBlock key={message.id} message={message} />;
            })
            .reverse()}
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end w-full gap-2 basis-1/12 pb-4">
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
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <SendIcon size={16} />
          </Button>
        </form>
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
