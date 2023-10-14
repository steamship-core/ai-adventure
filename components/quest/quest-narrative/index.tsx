"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "../shared/end-sheet";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat, Message } from "ai/react";
import { useParams } from "next/navigation";
import { Block } from "@/lib/streaming-client/src";
import { getFormattedBlocks } from "./utils";
import { NarrativeBlock } from "./narrative-block";
import { UserInputBlock } from "./user-input-block";
import { ExtendedBlock } from "./utils";
import { getGameState } from "@/lib/game/game-state.server";

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
  agentBaseUrl,
  completeButtonText,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: () => void;
  isComplete: boolean;
  agentBaseUrl: string;
  completeButtonText?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { questId } = useParams();

  const [priorBlocks, setPriorBlocks] = useState<ExtendedBlock[]>([]);

  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      context_id: questId,
      agentBaseUrl,
    },
    id,
  });

  useEffect(() => {
    fetch(`/api/game/quest?questId=${questId}`).then(async (response) => {
      if (response.ok) {
        let blocks = ((await response.json()) || {}).blocks as ExtendedBlock[];
        if (blocks && blocks.length > 0) {
          for (let block of blocks) {
            block.historical = true;
          }
          setPriorBlocks(blocks.reverse());
        } else {
          // We have no history, so we should say "start a quest"
          console.log("Append chat history");
          append({
            content: "Let's go on an adventure!",
            role: "user",
          });
        }
      }
    });
  }, []);

  let nonPersistedUserInput: string | null = null;
  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages
            .map((message) => {
              if (message.role === "user") {
                nonPersistedUserInput = message.content;
                return (
                  <UserInputBlock text={message.content} key={message.id} />
                );
              }
              return (
                <NarrativeBlock
                  key={message.id}
                  blocks={getFormattedBlocks(message, nonPersistedUserInput)}
                  onSummary={onSummary}
                  onComplete={onComplete}
                />
              );
            })
            .reverse()}
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks.reverse()}
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
          <EndSheet
            isEnd={true}
            summary={summary}
            completeButtonText={completeButtonText}
          />
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
