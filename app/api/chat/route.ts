import { Message, StreamingTextResponse } from "ai";
import Steamship, { SteamshipStream } from "@steamship/client";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getSteamshipClient } from "@/lib/utils";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Extract the `prompt` from the body of the request
  const { context_id, messages } = (await req.json()) as {
    context_id: string;
    messages: Message[];
  };
  const mostRecentUserMessage = messages
    .reverse()
    .find((message) => message.role === "user");

  const steamship = getSteamshipClient();
  console.log("payload", {
    prompt: mostRecentUserMessage?.content || "",
    context_id,
  });
  // See https://docs.steamship.com/javascript_client for information about:
  // - The BASE_URL where your running Agent lives
  // - The context_id which mediates your Agent's server-side chat history
  const response = await steamship.agent.respondAsync({
    url: process.env.PLACEHOLDER_STEAMSHIP_AGENT_URL!,
    input: {
      prompt: mostRecentUserMessage?.content || "",
      context_id,
    },
  });

  console.log(response);

  // Adapt the Streamship Blockstream into a Markdown Stream
  const stream = await SteamshipStream(response, steamship, {
    streamTimeoutSeconds: 60,
    // Use: "markdown" | "json"
    format: "json",
  });

  // Respond with a stream of Markdown
  return new StreamingTextResponse(stream);
}
