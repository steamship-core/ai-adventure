import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async () => {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    log.error(`No agent found for user ${userId}`);
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  log.info(`Agent found for user ${userId}`);

  try {
    const gameState = await getGameState(agent!.agentUrl);
    return NextResponse.json({ gameState }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
});
