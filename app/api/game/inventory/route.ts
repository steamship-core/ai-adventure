import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { getGameState, saveGameState } from "@/lib/game/game-state";
import { GameState } from "@/lib/game/schema/game_state";
import { startQuest } from "@/lib/game/quest";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  try {
    const gameState = (await getGameState(agent!.agentUrl)) as GameState;
    return NextResponse.json(gameState?.player?.inventory, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
