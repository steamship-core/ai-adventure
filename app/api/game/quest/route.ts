import { getAgent } from "@/lib/agent/agent.server";
import { loadExistingQuestBlocks, startQuest } from "@/lib/game/quest.server";
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

  const searchParams = new URL(request.url).searchParams;
  const questId = searchParams.get("questId");

  if (!questId) {
    return NextResponse.json(
      { error: "questId not in param string" },
      { status: 404 }
    );
  }

  const agent = await getAgent(userId);

  if (!agent) {
    console.log("no agent");
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    let blocks = await loadExistingQuestBlocks(agent!.agentUrl, questId);
    for (let block of blocks) {
      block;
    }
    return NextResponse.json({ blocks }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
