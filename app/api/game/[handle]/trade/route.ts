import { getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { tradeItems } from "@/lib/game/trade";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const userId = getUserIdFromClerkOrAnon(false);

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { counter_party, sell, buy } = await request.json();

  try {
    return tradeItems(agent!.agentUrl, {
      counter_party,
      sell,
      buy,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: `Unable to complete trade: ${e}` },
      { status: 404 }
    );
  }
}
