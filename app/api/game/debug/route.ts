import { deleteAgent, getAgent } from "@/lib/agent/agent.server";
import { getGameState, saveGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
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
    operation: "top-up-energy" | "reset" | "deplete-energy";
  };

  try {
    if (operation == "top-up-energy") {
      log.info(`Topping up energy for ${userId}: ${agent?.agentUrl}`);
      let gameState = await getGameState(agent?.agentUrl);
      await saveGameState(agent?.agentUrl, {
        ...gameState,
        player: { ...(gameState?.player || {}), energy: 100 },
      });
      gameState = await getGameState(agent?.agentUrl);
      return NextResponse.json(gameState);
    } else if (operation == "deplete-energy") {
      log.info(`Depleting energy for ${userId}: ${agent?.agentUrl}`);
      console.log(`Depleting energy for ${userId}: ${agent?.agentUrl}`);
      let gameState = await getGameState(agent?.agentUrl);
      await saveGameState(agent?.agentUrl, {
        ...gameState,
        player: { ...(gameState?.player || {}), energy: 1 },
      });
      gameState = await getGameState(agent?.agentUrl);
      return NextResponse.json(gameState);
    } else if (operation == "reset") {
      log.info(`Resetting ${userId}: ${agent?.agentUrl}`);
      await deleteAgent(userId);
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
