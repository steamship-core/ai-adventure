import { Block } from "@/lib/streaming-client/src";
import { Message } from "ai";

export const MessageTypes = {
  STATUS_MESSAGE: "STATUS_MESSAGE",
  SYSTEM_MESSAGE: "SYSTEM_MESSAGE",
  USER_MESSAGE: "USER_MESSAGE",
  STREAMED_TO_CHAT_HISTORY: "STREAMED_TO_CHAT_HISTORY",
  FUNCTION_SELECTION: "FUNCTION_SELECTION",
  STREAMING_BLOCK: "STREAMING_BLOCK",
  QUEST_SUMMARY: "QUEST_SUMMARY",
  QUEST_COMPLETE: "QUEST_COMPLETE",
  ITEM_GENERATION_CONTENT: "ITEM_GENERATION_CONTENT",
  IMAGE: "IMAGE",
  SCENE_AUDIO: "SCENE_AUDIO",
  CAMP_AUDIO: "CAMP_AUDIO",
  TEXT: "TEXT",
  QUEST_ARC: "QUEST_ARC",
  DICE_ROLL: "DICE_ROLL",
  QUEST_FAILED: "QUEST_FAILED",
} as const;

export const validTypes = [
  MessageTypes.IMAGE,
  MessageTypes.TEXT,
  MessageTypes.STREAMING_BLOCK,
  MessageTypes.ITEM_GENERATION_CONTENT,
  MessageTypes.DICE_ROLL,
] as string[];

export type ExtendedBlock = Block & {
  /**
   * Used to indicate the block is from a prior chat history session. Important because we
   * choose to show or hide user input blocks depending on whether they are historical
   */
  historical?: boolean;

  /**
   * The url where the contents cen be streamed from.
   */
  streamingUrl?: string;
};

export const getMessageType = (block: Block) => {
  if (block.tags?.find((tag) => tag.name === "dice_roll")) {
    return MessageTypes.DICE_ROLL;
  }
  if (block.tags?.find((tag) => tag.name === "item_generation_content")) {
    return MessageTypes.ITEM_GENERATION_CONTENT;
  }
  if (
    block.tags?.find((tag) => tag.name === "background" && tag.kind === "scene")
  ) {
    return MessageTypes.IMAGE;
  }
  if (block.tags?.find((tag) => tag.name === "quest-complete")) {
    return MessageTypes.QUEST_COMPLETE;
  }
  if (block.tags?.find((tag) => tag.name === "quest-failed")) {
    return MessageTypes.QUEST_FAILED;
  }
  if (block.tags?.find((tag) => tag.name === "quest_summary")) {
    return MessageTypes.QUEST_SUMMARY;
  }
  if (block.tags?.find((tag) => tag.name === "image")) {
    return MessageTypes.IMAGE;
  }
  if (block.tags?.find((tag) => tag.kind === "quest_arc")) {
    return MessageTypes.QUEST_ARC;
  }
  if (block.tags?.find((tag) => tag.kind === "scene" && tag.name === "audio")) {
    return MessageTypes.SCENE_AUDIO;
  }
  if (block.tags?.find((tag) => tag.kind === "camp" && tag.name === "audio")) {
    return MessageTypes.CAMP_AUDIO;
  }
  if (block?.tags?.find((tag) => tag.kind === "status-message")) {
    return MessageTypes.STATUS_MESSAGE;
  }
  if (
    block?.tags?.find(
      (tag) => tag.kind === "chat" && tag?.value?.["string-value"] === "system"
    )
  ) {
    return MessageTypes.SYSTEM_MESSAGE;
  }
  if (
    block?.tags?.find(
      (tag) => tag.kind === "chat" && tag?.value?.["string-value"] === "user"
    )
  ) {
    return MessageTypes.USER_MESSAGE;
  }
  if (block.streamState) {
    return MessageTypes.STREAMING_BLOCK;
  }
  if (
    block?.tags?.find(
      (tag) => tag.kind === "chat" && tag?.name === "streamed-to-chat-history"
    )
  ) {
    return MessageTypes.STREAMED_TO_CHAT_HISTORY;
  }
  if (block?.tags?.find((tag) => tag.kind === "function-selection")) {
    return MessageTypes.FUNCTION_SELECTION;
  }
  return MessageTypes.TEXT;
};

export const getFormattedBlocks = (
  message: Message,
  nonPersistedUserInput: string | null
) => {
  const blocks = message.content
    .split(/\r?\n|\r|\n/g)
    .map((block) => {
      if (block) {
        try {
          return JSON.parse(block) as Block;
        } catch (e) {
          return null;
        }
      }
      return null;
    })
    .filter((block) => {
      // When we send up input, this allows us to render it immediately.. but then also skip it when it
      // gets played back to us.
      return block && block.text != nonPersistedUserInput;
    }) as Block[];

  // TODO(Ted): I'm not sure if this is necessary because of the way we're doing block streaming.
  const combinedBlocks = blocks.reduce((acc, block) => {
    const existingBlock = acc.find((b) => b.id === block.id);
    if (existingBlock) {
      acc.splice(acc.indexOf(existingBlock), 1);
    }
    acc.push(block);
    return acc;
  }, [] as Block[]);

  return combinedBlocks;
};
