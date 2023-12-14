import { getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { loadExistingCampBlocks } from "@/lib/game/quest.server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const userId = getUserIdFromClerkOrAnon(false);

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    console.log("no agent");
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    let blocks = await loadExistingCampBlocks(agent!.agentUrl);
    return NextResponse.json({ blocks }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load camp blocks." },
      { status: 500 }
    );
  }
}
