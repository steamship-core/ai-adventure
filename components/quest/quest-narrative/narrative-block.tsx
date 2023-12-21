import { recoilBlockHistory } from "@/components/providers/recoil";
import { MessageTypes, getMessageType } from "@/lib/chat/block-chat-types";
import { ExtendedBlock } from "@/lib/chat/extended-block";
import { Block } from "@/lib/streaming-client/src";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
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
  blocks,
  onSummary,
  onComplete,
  offerAudio,
  orderedBlocks,
  isPrior,
}: {
  blocks: ExtendedBlock[];
  onSummary: (block: Block) => void;
  onComplete: (failed?: boolean) => void;
  offerAudio?: boolean;
  orderedBlocks: Block[];
  isPrior?: boolean;
}) => {
  const [chatHistory] = useRecoilState(recoilBlockHistory);

  const sortedBlocks = useMemo(() => {
    if (!blocks.toSorted) return blocks;
    return blocks
      .toSorted((a, b) => {
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
      })
      .toReversed();
  }, [blocks]);

  // const hasValidTypes = sortedBlocks.some((block) =>
  //   validTypes.includes(getMessageType(block))
  // );

  // if (!hasValidTypes && sortedBlocks.length !== 0) {
  //   return <LoaderIcon className="animate-spin" />;
  // }

  // Begin Debug Information State Management
  try {
    return sortedBlocks.map((block) => {
      let hideOutput = false;
      if (!isPrior && orderedBlocks.length > 0) {
        const isFirstBlock = block.id === orderedBlocks[0].id;
        const isInChatHistory = chatHistory.find((id) => id === block.id);

        if (!(isFirstBlock || isInChatHistory)) {
          hideOutput = true;
        }
      }

      switch (getMessageType(block)) {
        case MessageTypes.TEXT:
          return (
            <TextBlock
              key={block.id}
              offerAudio={offerAudio}
              blockId={block.id}
              text={block.text!}
              hideOutput={hideOutput}
              isPrior={isPrior}
            />
          );
        case MessageTypes.DICE_ROLL:
          return (
            <DiceRollBlock
              key={block.id}
              block={block}
              disableAnimation={isPrior === true}
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
              hideOutput={hideOutput}
              isPrior={isPrior}
            />
          );
        case MessageTypes.QUEST_COMPLETE:
          return (
            <CompletionBlock
              key={block.id}
              block={block}
              onComplete={onComplete}
            />
          );
        case MessageTypes.QUEST_FAILED:
          return (
            <FailedBlock key={block.id} block={block} onComplete={onComplete} />
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
          return (
            <ItemGenerationBlock
              key={block.id}
              block={block}
              hideOutput={hideOutput}
            />
          );
        case MessageTypes.IMAGE:
          return (
            <ImageBlock key={block.id} block={block} hideOutput={hideOutput} />
          );
        case MessageTypes.SCENE_AUDIO:
          return <BackgroundAudioBlock key={block.id} block={block} />;
        case MessageTypes.QUEST_ARC:
          return <QuestArcDebugBlock key={block.id} block={block} />;
        default:
          return <FallbackDebugBlock key={block.id} block={block} />;
      }
    });
  } catch (e) {
    console.log(`Error ${e}`);
    return null;
  }
};
