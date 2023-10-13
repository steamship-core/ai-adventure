import { Message } from "ai";
import { MessageTypes, getFormattedBlock, getMessageType } from "./utils";
import { useId } from "react";
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

export const NarrativeBlock = ({
  message,
  onSummary,
  onComplete,
}: {
  message: Message;
  onSummary: (block: Block) => void;
  onComplete: () => void;
}) => {
  try {
    const blocks = getFormattedBlock(message);
    console.log(blocks);
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
