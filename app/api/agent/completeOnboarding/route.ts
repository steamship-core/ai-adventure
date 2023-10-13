import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { completeOnboarding } from "@/lib/game/onboarding";
import { log } from "next-axiom";
import { getAgent } from "@/lib/agent/agent.server";

export async function POST(request: Request) {
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
    await completeOnboarding(agent.agentUrl);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    return NextResponse.json(
      { error: "Failed to complete onboarding." },
      { status: 404 }
    );
  }
}
