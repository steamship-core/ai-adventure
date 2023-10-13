import { StreamingTextResponse } from "ai";
import Steamship, { SteamshipStream } from "@/lib/streaming-client/src";
import { getSteamshipClient } from "@/lib/utils";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { blockId } = (await req.json()) as {
    blockId: string;
  };
  const steamship = getSteamshipClient();

  const decoder = new TextDecoder();
  let str = "";
  const response = await steamship.block.raw({ id: blockId });
  return new StreamingTextResponse(
    new ReadableStream({
      async pull(controller): Promise<void> {
        for await (const chunk of response.body as any) {
          str += decoder.decode(chunk);
          controller.enqueue(
            JSON.stringify({
              id: blockId,
              text: str,
            }) + "\n"
          );
        }
        controller.close();
      },
    })
  );
}
