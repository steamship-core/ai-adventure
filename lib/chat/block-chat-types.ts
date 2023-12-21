import { Block } from "@/lib/streaming-client/src";

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
