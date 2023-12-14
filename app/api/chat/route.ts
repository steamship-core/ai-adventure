import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { SteamshipStream } from "@/lib/streaming-client/src";
import { getSteamshipClient } from "@/lib/utils";
import { Message } from "ai";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const userId = getUserIdFromClerkOrAnon(false);

  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  log.debug(`/api/chat [user ${userId}] Begin`);
  // Extract the `prompt` from the body of the request
  // TODO: It's not secure to allow the web user to pass the agentBaseUrl, but
  // Edge functions don't support Prisma. Can we use a Clerk user param? Or Session Cookie?
  const { context_id, messages, agentBaseUrl } = (await req.json()) as {
    context_id: string;
    messages: Message[];
    agentBaseUrl: string;
  };
  log.debug(`/api/chat [user ${userId}] Base url: ${agentBaseUrl}`);

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

  return new Response(stream);
}
