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
  return new TransformStream<ParsedEvent, Block>({
    transform(event: ParsedEvent, controller) {
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
        client.block.get({ id: blockId }).then((block) => {
          return new Promise<void>((resolve, reject) => {
            if (!block) {
              console.log("Block ID did not appear to exist", blockId);
              controller.error(
                new Error(`Block ID did not appear to exist ${blockId}`)
              );
              reject();
              return;
            }
            try {
              console.log("enqueueing block", block);
              controller.enqueue(block);
              resolve();
            } catch (e) {
              log.debug(`Failed to enqueue block ${block}`);
              console.log("Failed to enqueue block", block);
              console.log(e);
              controller.error(e);
              reject();
              return;
            }
          });
        });
      } catch (e) {
        console.log("FileEventStreamToBlockStream error", e);
        controller.error(e);
        return;
      }
    },
  });
}

export { FileEventStreamToBlockStream };
