import { StreamingTextResponse } from "ai";
import Steamship, { SteamshipStream } from "@steamship/client";

// IMPORTANT! Set the runtime to edgew
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt, context_id } = await req.json();

  const steamship = new Steamship({ apiKey: process.env.STEAMSHIP_API_KEY });

  // See https://docs.steamship.com/javascript_client for information about:
  // - The BASE_URL where your running Agent lives
  // - The context_id which mediates your Agent's server-side chat history
  const response = await steamship.agent.respondAsync({
    url: "https://viable-house.steamship.run/ai-adventure-game-beta-hed-2yksc6/ai-adventure-game-beta-hed",
    input: {
      prompt,
      context_id,
    },
  });

  // Adapt the Streamship Blockstream into a Markdown Stream
  const stream = await SteamshipStream(response, steamship, {
    streamTimeoutSeconds: 30,
    // Use: "markdown" | "json"
    format: "json",
  });

  // Respond with a stream of Markdown
  return new StreamingTextResponse(stream);
}
