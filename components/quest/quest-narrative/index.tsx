"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "../shared/end-sheet";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { Block, PartialBlock } from "@/lib/streaming-client/src";
import { UserInputBlock } from "./user-input-block";
import { MessageTypes, getFormattedBlock, getMessageType } from "./utils";
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
import { useDebugMode } from "@/lib/hooks";

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

  // Begin Debug Information State Management
  const { isDebugMode } = useDebugMode();
  // End Debug Information State Management

  useEffect(() => {
    // Manually submit a message of   "Let's go on an adventure!" when the quest narrative loads
    inputRef?.current?.form?.requestSubmit();
  }, []);

  // Get the blocks so that we can filter and sort them.
  let blocks: PartialBlock[] = [];
  for (let message of messages || []) {
    if (message.role == "user") {
      blocks.push({ text: message.content });
    } else {
      const _subBlocks = getFormattedBlock(message);
      for (let subBlock of _subBlocks) {
        blocks.push(subBlock);
      }
    }
  }

  // Filter and sort them.
  blocks = [...priorBlocks, ...blocks].filter((block) => {
    const type = getMessageType(block as Block);
    return (
      block.id &&
      (isDebugMode ||
        (type != MessageTypes.STATUS_MESSAGE &&
          type != MessageTypes.SYSTEM_MESSAGE &&
          type != MessageTypes.FUNCTION_SELECTION))
    );
  });

  // Sort them
  blocks = blocks.sort((a, b) => {
    if (typeof a.index == "undefined") {
      return -1;
    }
    if (typeof b.index == "undefined") {
      return 1;
    }
    if (a.index == b.index) {
      return 0;
    }
    return a.index > b.index ? -1 : 1;
  });

  let elements = [];

  // Finally wrap them in elements
  for (let _block of blocks || []) {
    let block = _block as Block;
    switch (getMessageType(block)) {
      case MessageTypes.TEXT:
        elements.push(<TextBlock key={block.id} text={block.text!} />);
        break;
      case MessageTypes.STATUS_MESSAGE:
        elements.push(<StatusBlock key={block.id} block={block} />);
        break;
      case MessageTypes.SYSTEM_MESSAGE:
        elements.push(<SystemBlock key={block.id} block={block} />);
        break;
      case MessageTypes.STREAMED_TO_CHAT_HISTORY:
        <ChatHistoryBlock key={block.id} block={block} />;
        break;
      case MessageTypes.FUNCTION_SELECTION:
        elements.push(<FunctionCallBlock key={block.id} block={block} />);
        break;
      case MessageTypes.USER_MESSAGE:
        elements.push(<TextBlock key={block.id} text={block.text || ""} />);
        break;
      case MessageTypes.STREAMING_BLOCK:
        elements.push(<StreamingBlock key={block.id} block={block} />);
        break;
      case MessageTypes.QUEST_COMPLETE:
        elements.push(
          <CompletionBlock
            key={block.id}
            block={block}
            onComplete={onComplete}
          />
        );
        break;
      case MessageTypes.QUEST_SUMMARY:
        elements.push(
          <QuestSummaryBlock
            key={block.id}
            block={block}
            onSummary={onSummary}
          />
        );
        break;
      case MessageTypes.ITEM_GENERATION_CONTENT:
        elements.push(<ItemGenerationBlock key={block.id} block={block} />);
        break;
      case MessageTypes.IMAGE:
        elements.push(<ImageBlock key={block.id} block={block} />);
        break;
      default:
        elements.push(<FallbackBlock key={block.id} block={block} />);
        break;
    }
  }

  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>{elements}</QuestNarrativeContainer>
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
