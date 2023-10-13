import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { startQuest, loadQuest } from "@/lib/game/quest.server";
import { getAgent } from "@/lib/agent/agent.server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    const quest = await startQuest(agent!.agentUrl);
    return NextResponse.json({ quest }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { questId } = await request.json();

  try {
    const quest = await loadQuest(agent!.agentUrl, questId);
    return NextResponse.json({ quest }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
