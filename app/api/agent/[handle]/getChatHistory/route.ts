import { getAgent } from "@/lib/agent/agent.server";
import { ExtendedBlock } from "@/lib/chat/extended-block";
import { loadExistingQuestBlocks } from "@/lib/game/quest.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export const maxDuration = 300;

/**
 * Returns the chat history for a particular quest.
 * @param request
 * @param param1
 * @returns
 */
export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
): Promise<NextResponse> {
  const { userId } = auth();
  const { id } = await request.json();

  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const history =
    ((await loadExistingQuestBlocks(agent!.agentUrl, id)) as ExtendedBlock[]) ||
    [];

  return NextResponse.json(history);
}
