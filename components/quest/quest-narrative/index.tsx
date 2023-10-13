"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "../shared/end-sheet";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { NarrativeBlock } from "./narrrative-block";
import { Block } from "@/lib/streaming-client/src";
import { UserInputBlock } from "./user-input-block";
import { MessageTypes, getFormattedBlock, getMessageType } from "./utils";
import block from "@/lib/streaming-client/src/operations/block";
import { CompletionBlock } from "./completion-block";
import {
  StatusBlock,
  SystemBlock,
  ChatHistoryBlock,
  FunctionCallBlock,
  UserMessageBlock,
  FallbackBlock,
} from "./debug-blocks";
import { ImageBlock } from "./image-block";
import { ItemGenerationBlock } from "./item-generation-block";
import { QuestSummaryBlock } from "./quest-summary-block";
import { StreamingBlock } from "./streaming-block";
import { TextBlock } from "./text-block";

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
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        context_id: questId,
        agentBaseUrl,
      },
      id,
      initialInput: "Start a Quest",
    });

  // Begin Debug Information State Management
  const showDebugInformationKey = "showDebugInformation";
  const [showDebugInformation, setShowDebugInformation] = useState(false);
  useEffect(() => {
    const preference = localStorage.getItem(showDebugInformationKey);
    if (preference) {
      setShowDebugInformation(JSON.parse(preference));
    }
  }, [showDebugInformationKey, showDebugInformation]);
  // End Debug Information State Management

  useEffect(() => {
    // Manually submit a message of   "Let's go on an adventure!" when the quest narrative loads
    inputRef?.current?.form?.requestSubmit();
  }, []);

  let blocks = [];

  for (let message of messages || []) {
    // If we're supposed to show debug information, show everything
    if (showDebugInformation) return true;

    // Else, filter out system messages
    if (message.role == "user") {
      blocks.push(<UserInputBlock key={message.id} text={message.content} />);
    } else {
      // It's a narrative block
      const _subBlocks = getFormattedBlock(message);
      for (let subBlock of _subBlocks) {
        switch (getMessageType(subBlock)) {
          case MessageTypes.TEXT:
            blocks.push(<TextBlock key={subBlock.id} text={subBlock.text!} />);
            break;
          case MessageTypes.STATUS_MESSAGE:
            if (showDebugInformation) {
              blocks.push(<StatusBlock key={subBlock.id} block={subBlock} />);
            }
            break;
          case MessageTypes.SYSTEM_MESSAGE:
            if (showDebugInformation) {
              blocks.push(<SystemBlock key={subBlock.id} block={subBlock} />);
            }
            break;
          case MessageTypes.STREAMED_TO_CHAT_HISTORY:
            blocks.push(
              <ChatHistoryBlock key={subBlock.id} block={subBlock} />
            );
            break;
          case MessageTypes.FUNCTION_SELECTION:
            if (showDebugInformation) {
              blocks.push(
                <FunctionCallBlock key={subBlock.id} block={subBlock} />
              );
            }
            break;
          case MessageTypes.USER_MESSAGE:
            blocks.push(
              <UserMessageBlock key={subBlock.id} block={subBlock} />
            );
            break;
          case MessageTypes.STREAMING_BLOCK:
            blocks.push(<StreamingBlock key={subBlock.id} block={subBlock} />);
            break;
          case MessageTypes.QUEST_COMPLETE:
            blocks.push(
              <CompletionBlock
                key={subBlock.id}
                block={subBlock}
                onComplete={onComplete}
              />
            );
            break;
          case MessageTypes.QUEST_SUMMARY:
            blocks.push(
              <QuestSummaryBlock
                key={subBlock.id}
                block={subBlock}
                onSummary={onSummary}
              />
            );
            break;
          case MessageTypes.ITEM_GENERATION_CONTENT:
            blocks.push(
              <ItemGenerationBlock key={subBlock.id} block={subBlock} />
            );
            break;
          case MessageTypes.IMAGE:
            blocks.push(<ImageBlock key={subBlock.id} block={subBlock} />);
            break;
          default:
            blocks.push(<FallbackBlock key={subBlock.id} block={subBlock} />);
            break;
        }
      }
    }
  }

  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>{blocks.reverse()}</QuestNarrativeContainer>
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
