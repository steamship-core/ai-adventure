import { Client, Block } from "../schema";
import { isStreamTerminatingBlock } from "./utils";
const decoder = new TextDecoder();

/**
 * Converts a stream of Blocks to a stream of JSON that repeats blocks if they themselves are in the process of streaming.
 * @param client
 * @returns
 */
function BlockStreamToStreamingBlockStream(
  client: Client
): TransformStream<Block, string> {
  // An ID:Block map of the streaming blocks in progress
  let streamingBlocks: Record<string, Block> = {};

  // An ID:Promise map of the streaming block promises
  let streamingPromises: Record<string, Promise<void>> = {};

  // Remember if we've received the "hang-up" bit yet.
  let receivedStreamTermination = false;

  return new TransformStream<Block, string>({
    transform(block: Block, controller) {
      const blockId = block.id;

      if (!blockId) {
        controller.error(new Error("Empty Block ID"));
        return;
      }

      // Only hang up if we're not still streaming any block updates.
      const maybeHangup = () => {
        if (Object.keys(streamingBlocks).length == 0) {
          // controller.terminate();
          return true;
        }
        return false;
      };

      // If this block signals termination, remember.
      if (isStreamTerminatingBlock(block)) {
        receivedStreamTermination = true;
        if (maybeHangup()) {
          return;
        }
      }

      // Upon a new block, we always pass it right on through.
      controller.enqueue(JSON.stringify(block) + "\n");
      // For blocks that are either TEXT or MARKDOWN and also streaming, we will additionally set up an update stream.
      const isStreaming = block.streamState == "started";
      const isText =
        block.mimeType?.toLocaleLowerCase()?.includes("text") === true ||
        block.mimeType?.toLocaleLowerCase()?.includes("markdown") === true;
      const shouldBeginUpdateStream = isStreaming && isText;

      if (!shouldBeginUpdateStream) {
        // Our work here is done!
        return;
      }

      // Set up an update stream.
      streamingBlocks[blockId] = block;

      streamingPromises[blockId] = new Promise<void>(
        async (resolve, reject) => {
          try {
            const response = await client.block.raw({ id: blockId });
            if (!response.ok) {
              const error = new Error(
                `Got back error streaming block: ${await response.text()}`
              );
              controller.error(error);
              reject(error);
              return;
            }
            for await (const chunk of response.body as any) {
              const str = decoder.decode(chunk);
              // Look up the block.
              streamingBlocks[blockId].text += str;
              // Stream an update.
              controller.enqueue(
                JSON.stringify({
                  id: blockId,
                  text: streamingBlocks[blockId].text,
                }) + "\n"
              );
            }

            // Remove the block from the map.
            delete streamingBlocks[blockId];

            // Possibly end the whole stream.
            maybeHangup();

            // Resolve, but nobody is really listening.
            resolve();
          } catch (error) {
            controller.error(error);
            reject(error);
          }
        }
      );
    },
  });
}

export { BlockStreamToStreamingBlockStream };
