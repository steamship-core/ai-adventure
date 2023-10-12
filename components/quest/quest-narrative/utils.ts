import { Block } from "@steamship/client";
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
  TEXT: "TEXT",
} as const;

export const getMessageType = (block: Block) => {
  if (block.tags?.find((tag) => tag.name === "item_generation_content")) {
    return MessageTypes.ITEM_GENERATION_CONTENT;
  }
  if (block.tags?.find((tag) => tag.name === "quest-complete")) {
    return MessageTypes.QUEST_COMPLETE;
  }
  if (block.tags?.find((tag) => tag.name === "quest_summary")) {
    return MessageTypes.QUEST_SUMMARY;
  }
  if (block.streamState === "started") {
    return MessageTypes.STREAMING_BLOCK;
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

// 🤮
export const getFormattedBlock = (message: Message) => {
  const blocks = message.content
    .split(/\r?\n|\r|\n/g)
    .map((block) => {
      return block ? (JSON.parse(block) as Block) : null;
    })
    .filter((block) => block) as Block[];

  const combinedBlocks = blocks.reduce((acc, block) => {
    const existingBlock = acc.find((b) => b.id === block.id);
    if (existingBlock) {
      acc.splice(acc.indexOf(existingBlock), 1);
    }
    acc.push(block);
    return acc;
  }, [] as Block[]);

  return combinedBlocks.reverse();
};