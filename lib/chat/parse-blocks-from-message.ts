import { Message } from "ai";
import { log } from "next-axiom";
import { Block } from "../streaming-client/src/schema/block";

/**
 *
 * @param message Parses
 * @param nonPersistedUserInput
 * @returns
 */
export function chatMessageJsonlToBlocks(
  message: Message,
  skipIfInputEquals: string | null
): Block[] {
  const applySkipIfInput =
    skipIfInputEquals != null && skipIfInputEquals.trim().length > 0;

  const blocks = message.content
    .split(/\r?\n|\r|\n/g)
    .map((block) => {
      if (block) {
        try {
          return JSON.parse(block) as Block;
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
    }) as Block[];

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
): Block[] {
  let ret: Block[] = [];
  for (let msg of messages || []) {
    ret = [...ret, ...chatMessageJsonlToBlocks(msg, skipIfInputEquals)];
  }
  return ret;
}
