import { Message, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getSteamshipClient } from "@/lib/utils";
import { SteamshipStream } from "@/lib/streaming-client/src";
import { log } from "next-axiom";
import prisma from "@/lib/db";

// IMPORTANT! Set the runtime to edgew
export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  log.debug("Begin POST /api/chat");

  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    log.error("No agent!");
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const agentBaseUrl = agent.agentUrl;
  log.debug(`Agent base url: ${agentBaseUrl}`);

  // Extract the `prompt` from the body of the request
  const { context_id, messages } = (await req.json()) as {
    context_id: string;
    messages: Message[];
  };
  log.debug(
    `Begin message length=${messages?.length} context_id=${context_id}`
  );

  const mostRecentUserMessage = messages
    .reverse()
    .find((message) => message.role === "user");
  log.debug(`Begin message=${mostRecentUserMessage}`);

  const steamship = getSteamshipClient();
  // See https://docs.steamship.com/javascript_client for information about:
  // - The BASE_URL where your running Agent lives
  // - The context_id which mediates your Agent's server-side chat history

  const response = await steamship.agent.respondAsync({
    url: agentBaseUrl,
    input: {
      prompt: mostRecentUserMessage?.content || "",
      context_id,
    },
  });

  log.debug(`Steamship response ${response}`);

  // Adapt the Streamship Blockstream into a Markdown Stream
  const stream = await SteamshipStream(response, steamship, {
    streamTimeoutSeconds: 600,
    // Use: "markdown" | "json"
    format: "json-no-inner-stream",
  });

  // Respond with a stream of Markdown
  return new StreamingTextResponse(stream);
}
