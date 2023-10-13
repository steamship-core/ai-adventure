import { Message } from "ai";
import { MessageTypes, getMessageType } from "./utils";
import { useEffect, useState } from "react";
import { TextBlock } from "./text-block";
import {
  ChatHistoryBlock,
  FallbackBlock,
  FunctionCallBlock,
  StatusBlock,
  SystemBlock,
  UserMessageBlock,
} from "./debug-blocks";
import { StreamingBlock } from "./streaming-block";
import { QuestSummaryBlock } from "./quest-summary-block";
import { Block } from "@/lib/streaming-client/src";
import { CompletionBlock } from "./completion-block";
import { ItemGenerationBlock } from "./item-generation-block";
import { ImageBlock } from "./image-block";
import { useDebugMode } from "@/lib/hooks";

export const NarrativeBlock = ({
  blocks,
  onSummary,
  onComplete,
}: {
  blocks: Block[];
  onSummary: (block: Block) => void;
  onComplete: () => void;
}) => {
  // Begin Debug Information State Management
  const { isDebugMode } = useDebugMode();
  try {
    const formattedBlocks = blocks
      .filter((block) => {
        const type = getMessageType(block as Block);
        return (
          block.id &&
          (isDebugMode ||
            (type != MessageTypes.STATUS_MESSAGE &&
              type != MessageTypes.SYSTEM_MESSAGE &&
              type != MessageTypes.FUNCTION_SELECTION))
        );
      })
      .sort((a, b) => {
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

    return blocks.map((block) => {
      switch (getMessageType(block)) {
        case MessageTypes.TEXT:
          return <TextBlock key={block.id} text={block.text!} />;
        case MessageTypes.STATUS_MESSAGE:
          return <StatusBlock key={block.id} block={block} />;
        case MessageTypes.SYSTEM_MESSAGE:
          return <SystemBlock key={block.id} block={block} />;
        case MessageTypes.STREAMED_TO_CHAT_HISTORY:
          return <ChatHistoryBlock key={block.id} block={block} />;
        case MessageTypes.FUNCTION_SELECTION:
          return <FunctionCallBlock key={block.id} block={block} />;
        case MessageTypes.USER_MESSAGE:
          return <UserMessageBlock key={block.id} block={block} />;
        case MessageTypes.STREAMING_BLOCK:
          return <StreamingBlock key={block.id} block={block} />;
        case MessageTypes.QUEST_COMPLETE:
          return (
            <CompletionBlock
              key={block.id}
              block={block}
              onComplete={onComplete}
            />
          );
        case MessageTypes.QUEST_SUMMARY:
          return (
            <QuestSummaryBlock
              key={block.id}
              block={block}
              onSummary={onSummary}
            />
          );
        case MessageTypes.ITEM_GENERATION_CONTENT:
          return <ItemGenerationBlock key={block.id} block={block} />;
        case MessageTypes.IMAGE:
          return <ImageBlock key={block.id} block={block} />;
        default:
          return <FallbackBlock key={block.id} block={block} />;
      }
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};
