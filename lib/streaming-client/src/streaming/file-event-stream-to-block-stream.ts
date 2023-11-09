/* ==========================================================================================
 * Steamship FileEventStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

import { ParsedEvent } from "eventsource-parser/stream";
import { log } from "next-axiom";
import { Block, Client } from "../schema";

function FileEventStreamToBlockStream(
  client: Client
): TransformStream<ParsedEvent, Block> {
  // Helper function to sleep for a given ms
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to retry enqueuing with exponential backoff
  const retryEnqueue = async (
    controller: TransformStreamDefaultController<Block>,
    block: Block,
    retries = 5
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        controller.enqueue(block);
        return; // Success, so we can return early
      } catch (e) {
        if (i < retries - 1) {
          // Log and wait before retrying
          console.log(
            `Retry ${i + 1}: Failed to enqueue block, retrying...`,
            block
          );
          await sleep(2 ** i * 100); // Exponential backoff
        } else {
          // If all retries fail, throw the error
          throw e;
        }
      }
    }
  };

  return new TransformStream<ParsedEvent, Block>({
    async transform(event: ParsedEvent, controller) {
      if (!event.data || !event.event) {
        console.log("no event data or event", event);
        return;
      }
      try {
        const parsedEvent = JSON.parse(event.data);
        const data = parsedEvent[event.event];
        const blockId = data.blockId;

        if (!blockId) {
          console.log("Empty Block ID");
          controller.error(new Error("Empty Block ID"));
          return;
        }

        const block = await client.block.get({ id: blockId });

        if (!block) {
          console.log("Block ID did not appear to exist", blockId);
          controller.error(
            new Error(`Block ID did not appear to exist ${blockId}`)
          );
          return;
        }
        await retryEnqueue(controller, block);
      } catch (e: any) {
        log.debug(`Failed to enqueue block: ${e?.message}`);
        console.log("Error in transform:", e);
        controller.error(e);
      }
    },
  });
}

export { FileEventStreamToBlockStream };
