import { deleteAgent, getAgent } from "@/lib/agent/agent.server";
import { getGameState, saveGameState } from "@/lib/game/game-state.server";
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

  const { operation } = (await request.json()) as {
    operation: "top-up-energy" | "reset";
  };

  try {
    if (operation == "top-up-energy") {
      let gameState = await getGameState(agent?.agentUrl);
      await saveGameState(agent?.agentUrl, {
        ...gameState,
        player: { ...(gameState?.player || {}), energy: 100 },
      });
      gameState = await getGameState(agent?.agentUrl);
      return NextResponse.json(gameState);
    } else if (operation == "reset") {
      await deleteAgent(userId);
      const hostName = new URL(request.url).host;
      return NextResponse.json(true);
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${operation}` },
        { status: 404 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
