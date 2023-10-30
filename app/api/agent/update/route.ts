import { getAgent } from "@/lib/agent/agent.server";
import { saveGameState } from "@/lib/game/game-state.server";
import { GameState } from "@/lib/game/schema/game_state";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (request: Request) => {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    // TODO: Filter what the user can send to the agent.
    const config = await request.json();
    await saveGameState(agent.agentUrl, config as GameState);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update agent." },
      { status: 404 }
    );
  }
});
