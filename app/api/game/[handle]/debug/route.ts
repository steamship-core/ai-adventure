import { deleteAgent, getAgent } from "@/lib/agent/agent.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { getGameState } from "@/lib/game/game-state.server";
import { log } from "next-axiom";
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

  const { operation } = (await request.json()) as {
    operation: "reset" | "dump-state";
  };

  try {
    if (operation == "dump-state") {
      log.info(`Dumping state for ${userId}: ${agent?.agentUrl}`);

      if (process.env.NEXT_PUBLIC_OFFER_STATE_DUMP !== "true") {
        // Don't allow!
        return NextResponse.json(
          {
            error:
              "To enable state dumping, please modify your environment variables.",
          },
          { status: 500 }
        );
      }
      console.log(`Dumping state for ${userId}: ${agent?.agentUrl}`);
      let gameState = await getGameState(agent?.agentUrl);
      const ret = {
        gameState,
        agentUrl: agent?.agentUrl,
      };
      log.info(JSON.stringify(ret));
      return NextResponse.json(ret);
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
    return NextResponse.json({ error: `Exception: ${e}` }, { status: 404 });
  }
}
