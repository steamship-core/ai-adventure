import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";

const HARDCODED_STEAMSHIP_AGENT_URL =
  "https://viable-house.steamship.run/ai-adventure-game-beta-ag1-0178tj/ai-adventure-game-beta-ag1";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const agent = await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: HARDCODED_STEAMSHIP_AGENT_URL,
      },
    });
    return NextResponse.json({ agent }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
