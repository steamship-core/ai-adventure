import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { saveGameState } from "@/lib/game/game-state.server";
import { GameState } from "@/lib/game/schema/game_state";
import { completeOnboarding } from "@/lib/game/onboarding";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const config = await request.json();

  try {
    const agent = await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: process.env.PLACEHOLDER_STEAMSHIP_AGENT_URL!,
      },
    });

    await saveGameState(agent.agentUrl, config as GameState);
    await completeOnboarding(agent.agentUrl);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
