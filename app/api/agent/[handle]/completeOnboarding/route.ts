import { getAgent } from "@/lib/agent/agent.server";
import { completeOnboarding } from "@/lib/game/onboarding";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(
  async (request: Request, { params }: { params: { handle: string } }) => {
    const { userId } = auth();
    if (!userId) {
      log.error("No user");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const agent = await getAgent(userId, params.handle);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    try {
      // TODO: Filter what the user can send to the agent.
      const res = await completeOnboarding(agent.agentUrl);
      console.log("Complete onboarding done");

      if (!res.ok) {
        console.log("ERs was not ok");
        const text = `[${res.status}] ${await res.text()}}`;
        console.log("ERs was not ok 2");
        log.error(`Failed to complete onboarding: ${text}`);
        console.log("ERs was not ok 3");
        return NextResponse.json({ error: text }, { status: res.status });
      }
      console.log("Returning");
      return NextResponse.json({ agent }, { status: 200 });
    } catch (e) {
      log.error(`${e}`);
      console.error(e);
      return NextResponse.json(
        { error: `Failed to complete onboarding. Error was: ${e}` },
        { status: 500 }
      );
    }
  }
);
