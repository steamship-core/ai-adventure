import { Message } from "ai";
import { log } from "next-axiom";
import { getMessageType, inputTypes, validTypes } from "./block-chat-types";
import { ExtendedBlock } from "./extended-block";

/**
 *
 * @param message Parses
 * @param nonPersistedUserInput
 * @returns
 */
export function chatMessageJsonlToBlocks(
  message: Message,
  skipIfInputEquals: string | null
): ExtendedBlock[] {
  const applySkipIfInput =
    skipIfInputEquals != null && skipIfInputEquals.trim().length > 0;

  const blocks = message.content
    .split(/\r?\n|\r|\n/g)
    .map((block) => {
      if (block) {
        try {
          const _block = JSON.parse(block) as ExtendedBlock;
          if (!_block.streamingUrl) {
            _block.streamingUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${_block.id}/raw`;
          }
          _block.historical = false;
          _block.messageType = getMessageType(_block);
          _block.isVisibleInChat = validTypes.includes(_block.messageType);
          _block.isInputElement = inputTypes.includes(_block.messageType);

          return _block;
        } catch (e) {
          console.log(
            `Error parsing block: ${e}. Block str was: ${block}. Message was: ${message.content}`
          );
          log.error(
            `Error parsing block: ${e}. Block str was: ${block}. Message was: ${message.content}`
          );
          return null;
        }
      }
      console.log(`Error parsing block. It was null.`);
      log.error(`Error parsing block. It was null.`);
      return null;
    })
    .filter((block) => {
      if (!block) {
        return false;
      }
      if (applySkipIfInput && block.text && skipIfInputEquals == block.text) {
        return false;
      }
      return true;
    }) as ExtendedBlock[];

  // At this point, `blocks` is a list of the JSON-parsed lines cast to the Block type

  // TODO(Ted): I'm not sure if this is necessary because of the way we're doing block streaming.
  // const combinedBlocks = blocks.reduce((acc, block) => {
  //   const existingBlock = acc.find((b) => b.id === block.id);
  //   if (existingBlock) {
  //     acc.splice(acc.indexOf(existingBlock), 1);
  //   }
  //   acc.push(block);
  //   return acc;
  // }, [] as Block[]);

  return blocks;
}

/**
 *
 * @param message Parses
 * @param nonPersistedUserInput
 * @returns
 */
export function chatMessagesJsonlToBlocks(
  messages: Message[],
  skipIfInputEquals: string | null
): ExtendedBlock[] {
  let ret: ExtendedBlock[] = [];
  for (let msg of messages || []) {
    ret = [...ret, ...chatMessageJsonlToBlocks(msg, skipIfInputEquals)];
  }
  return ret;
}
