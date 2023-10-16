import { getAgent } from "@/lib/agent/agent.server";
import { narrate } from "@/lib/game/narrate.server";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { block_id } = await request.json();

  try {
    const resp = await narrate(agent!.agentUrl, block_id);
    return NextResponse.json(resp);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
