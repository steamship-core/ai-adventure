/* ==========================================================================================
 * Steamship FileEventStream
 *
 * A FileStream is a stream of new Blocks added to a File. In the context of chat, these new
 * blocks represent multimedia messages being streamed into the ChatHistory.
 *
 * Portions the FileStream implementation have been adapted from the cohere-stream.
 *
 * =========================================================================================*/

import { Client, Block } from "../schema";
import { isStreamTerminatingBlock } from "./utils";

const decoder = new TextDecoder();

function BlockStreamToMarkdownStream(
  client: Client
): TransformStream<Block, string> {
  return new TransformStream<Block, string>({
    transform(block: Block, controller) {
      const blockId = block.id;

      if (!blockId) {
        controller.error(new Error("Empty Block ID"));
        return;
      }

      const contentUrl = client.url(`block/${blockId}/raw`);

      // If this block signals termination, hang up!
      if (isStreamTerminatingBlock(block)) {
        controller.terminate();
        return;
      }

      if (block.mimeType?.startsWith("audio/")) {
        controller.enqueue(`[audio](${contentUrl})\n\n`);
        return;
      } else if (block.mimeType?.startsWith("video/")) {
        controller.enqueue(`[video](${contentUrl})\n\n`);
        return;
      } else if (block.mimeType?.startsWith("image/")) {
        controller.enqueue(`![image](${contentUrl})\n\n`);
        return;
      } else {
        if (typeof block.text != "undefined") {
          if (block.text) {
            controller.enqueue(block.text + "\n\n");
          }
          return;
        }

        return new Promise<void>(async (resolve, reject) => {
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
              controller.enqueue(str);
            }
            controller.enqueue("\n\n");
            resolve();
          } catch (error) {
            controller.error(error);
            reject(error);
          }
        });
      }
    },
  });
}

export { BlockStreamToMarkdownStream };
