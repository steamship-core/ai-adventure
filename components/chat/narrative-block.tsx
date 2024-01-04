import { MessageTypes } from "@/lib/chat/block-chat-types";
import { ExtendedBlock } from "@/lib/chat/extended-block";
import { CompletionBlock } from "./completion-block";
import {
  BackgroundAudioBlock,
  FallbackDebugBlock,
  FunctionCallDebugBlock,
  QuestArcDebugBlock,
  StatusDebugBlock,
  SystemDebugBlock,
  UserMessageDebugBlock,
} from "./debug-blocks";
import { DiceRollBlock } from "./dice-block";
import { FailedBlock } from "./failed-block";
import { ImageBlock } from "./image-block";
import { ItemGenerationBlock } from "./item-generation-block";
import { QuestSummaryBlock } from "./quest-summary-block";
import { StreamingBlock } from "./streaming-block";
import { TextBlock } from "./text-block";
import { UserInputBlock } from "./user-input-block";

export const NarrativeBlock = ({
  block,
  offerAudio,
  isPrior,
  isFirst,
  advance,
}: {
  block: ExtendedBlock;
  offerAudio?: boolean;
  isPrior?: boolean;
  isFirst?: boolean;
  advance?: () => void;
}) => {
  switch (block.messageType) {
    case MessageTypes.TEXT:
      return (
        <TextBlock
          key={block.id}
          offerAudio={offerAudio}
          blockId={block.id}
          text={block.text!}
          isPrior={isPrior}
        />
      );
    case MessageTypes.DICE_ROLL:
      return (
        <DiceRollBlock
          key={block.id}
          block={block}
          disableAnimation={isPrior === true}
          advance={advance}
        />
      );
    case MessageTypes.STATUS_MESSAGE:
      return <StatusDebugBlock key={block.id} block={block} />;
    case MessageTypes.SYSTEM_MESSAGE:
      return <SystemDebugBlock key={block.id} block={block} />;
    case MessageTypes.STREAMED_TO_CHAT_HISTORY:
      return (
        <TextBlock
          key={block.id}
          blockId={block.id}
          offerAudio={offerAudio}
          text={block.text || ""}
          isPrior={isPrior}
        />
      );
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
      return (
        <StreamingBlock
          key={block.id}
          offerAudio={offerAudio}
          block={block}
          isPrior={isPrior}
        />
      );
    case MessageTypes.QUEST_COMPLETE:
      return <CompletionBlock key={block.id} block={block} />;
    case MessageTypes.QUEST_FAILED:
      return <FailedBlock key={block.id} block={block} />;
    case MessageTypes.QUEST_SUMMARY:
      return <QuestSummaryBlock key={block.id} block={block} />;
    case MessageTypes.ITEM_GENERATION_CONTENT:
      return <ItemGenerationBlock key={block.id} block={block} />;
    case MessageTypes.IMAGE:
      return <ImageBlock key={block.id} block={block} />;
    case MessageTypes.SCENE_AUDIO:
      return <BackgroundAudioBlock key={block.id} block={block} />;
    case MessageTypes.QUEST_ARC:
      return <QuestArcDebugBlock key={block.id} block={block} />;
    default:
      return <FallbackDebugBlock key={block.id} block={block} />;
  }
};
