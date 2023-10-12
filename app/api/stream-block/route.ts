import { StreamingTextResponse } from "ai";
import Steamship, { SteamshipStream } from "@steamship/client";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { blockId } = (await req.json()) as {
    blockId: string;
  };

  const steamship = new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    appBase: "https://apps.staging.steamship.com/",
    apiBase: "https://api.staging.steamship.com/api/v1/",
  });

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
