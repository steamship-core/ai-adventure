"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "../shared/end-sheet";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { Block } from "@/lib/streaming-client/src";
import { getFormattedBlocks } from "./utils";
import { NarrativeBlock } from "./narrative-block";

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
  agentBaseUrl,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: () => void;
  isComplete: boolean;
  agentBaseUrl: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { questId } = useParams();

  const [priorBlocks, setPriorBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch(`/api/game/quest?questId=${questId}`).then(async (response) => {
      if (response.ok) {
        let blocks = (await response.json()) as Block[];
        setPriorBlocks(blocks);
      }
    });
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        context_id: questId,
        agentBaseUrl,
      },
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
            .map((message) => {
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
                  blocks={getFormattedBlocks(message)}
                  onSummary={onSummary}
                  onComplete={onComplete}
                />
              );
            })
            .reverse()}
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks}
              onSummary={onSummary}
              onComplete={onComplete}
            />
          )}
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
