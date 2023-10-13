import { Block } from "../schema";
import { isStreamTerminatingBlock } from "./utils";
import { log } from "next-axiom";

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
      controller.enqueue(new TextEncoder().encode(str));
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
