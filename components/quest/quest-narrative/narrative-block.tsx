import { Block } from "@/lib/streaming-client/src";
import { CompletionBlock } from "./completion-block";
import {
  FallbackDebugBlock,
  FunctionCallDebugBlock,
  StatusDebugBlock,
  SystemDebugBlock,
  UserMessageDebugBlock,
} from "./debug-blocks";
import { ImageBlock } from "./image-block";
import { ItemGenerationBlock } from "./item-generation-block";
import { QuestSummaryBlock } from "./quest-summary-block";
import { StreamingBlock } from "./streaming-block";
import { TextBlock } from "./text-block";
import { UserInputBlock } from "./user-input-block";
import { ExtendedBlock, MessageTypes, getMessageType } from "./utils";

export const NarrativeBlock = ({
  blocks,
  onSummary,
  onComplete,
}: {
  blocks: ExtendedBlock[];
  onSummary: (block: Block) => void;
  onComplete: () => void;
}) => {
  // Begin Debug Information State Management
  try {
    const formattedBlocks = blocks.sort((a, b) => {
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

    return formattedBlocks.map((block) => {
      switch (getMessageType(block)) {
        case MessageTypes.TEXT:
          console.log("BLINGBLO", block);
          return <TextBlock key={block.id} text={block.text!} />;
        case MessageTypes.STATUS_MESSAGE:
          return <StatusDebugBlock key={block.id} block={block} />;
        case MessageTypes.SYSTEM_MESSAGE:
          return <SystemDebugBlock key={block.id} block={block} />;
        case MessageTypes.STREAMED_TO_CHAT_HISTORY:
          return <TextBlock key={block.id} text={block.text || ""} />;
        case MessageTypes.FUNCTION_SELECTION:
          return <FunctionCallDebugBlock key={block.id} block={block} />;
        case MessageTypes.USER_MESSAGE:
          if (block.text && block.historical) {
            return <UserInputBlock key={block.id} text={block.text} />;
          } else if (block.text) {
            return <UserMessageDebugBlock key={block.id} block={block} />;
          } else {
            return null;
          }
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
          return <FallbackDebugBlock key={block.id} block={block} />;
      }
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};
