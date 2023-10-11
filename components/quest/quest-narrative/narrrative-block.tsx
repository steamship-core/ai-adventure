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

const DEBUG_MODE = false;

export const NarrativeBlock = ({ message }: { message: Message }) => {
  try {
    const blocks = getFormattedBlock(message);
    console.log(blocks);
    // const textBlocks = blocks.filter(
    //   (b) => getMessageType(b) === MessageTypes.TEXT
    // );
    // const concattenatedText = textBlocks.reduce((acc, block) => {
    //   if (block?.text) {
    //     acc = `${acc}\n\n${block.text}`;
    //   }
    //   return acc;
    // }, "");

    return blocks.map((block) => {
      switch (getMessageType(block)) {
        case MessageTypes.TEXT:
          return <TextBlock key={block.id} text={block.text!} />;
        case MessageTypes.STATUS_MESSAGE:
          return DEBUG_MODE ? (
            <StatusBlock key={block.id} block={block} />
          ) : null;
        case MessageTypes.SYSTEM_MESSAGE:
          return DEBUG_MODE ? (
            <SystemBlock key={block.id} block={block} />
          ) : null;
        case MessageTypes.STREAMED_TO_CHAT_HISTORY:
          return DEBUG_MODE ? (
            <ChatHistoryBlock key={block.id} block={block} />
          ) : null;
        case MessageTypes.FUNCTION_SELECTION:
          return DEBUG_MODE ? (
            <FunctionCallBlock key={block.id} block={block} />
          ) : null;
        case MessageTypes.USER_MESSAGE:
          return DEBUG_MODE ? (
            <UserMessageBlock key={block.id} block={block} />
          ) : null;
        default:
          return DEBUG_MODE ? (
            <FallbackBlock key={block.id} block={block} />
          ) : null;
      }
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};
