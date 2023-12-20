import { getAgent } from "@/lib/agent/agent.server";
import { generateActionChoices } from "@/lib/game/quest.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const choices = await generateActionChoices(agent?.agentUrl!);

  return NextResponse.json(choices);
}
