import { log } from "next-axiom";
import { Block } from "../schema";
import { isStreamTerminatingBlock } from "./utils";

/**
 * Converts a stream of Blocks to a stream of JSON that repeats blocks if they themselves are in the process of streaming.
 * @param client
 * @returns
 */
function BlockStreamToBlockJsonStream(): TransformStream<Block, Uint8Array> {
  return new TransformStream<Block, Uint8Array>({
    transform(block: Block, controller) {
      const str = JSON.stringify(block) + "\n";
      log.debug(`Streaming ${str}`);
      try {
        const encodedStr = new TextEncoder().encode(str);
        try {
          controller.enqueue(encodedStr);
        } catch (e) {
          console.log("Failed to enqueue string", encodedStr);
          console.log(e);
          log.debug(`Failed to enqueue string ${encodedStr}`);
          log.debug(e as unknown as string);
        }
      } catch (e) {
        console.log("Failed to encode string", str);
        console.log(e);
        log.debug(`Failed to encode string ${str}`);
        log.debug(e as unknown as string);
      }
      // If this block signals termination, hang up!
      if (isStreamTerminatingBlock(block)) {
        log.debug(`Terminating Block`);
        controller.terminate();
        return;
      }
    },
  });
}

export { BlockStreamToBlockJsonStream };
