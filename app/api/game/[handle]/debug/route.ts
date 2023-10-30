import { deleteAgent, getAgent } from "@/lib/agent/agent.server";
import { getGameState, saveGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { operation } = (await request.json()) as {
    operation: "top-up-energy" | "reset" | "deplete-energy" | "dump-state";
  };

  try {
    if (operation == "top-up-energy") {
      log.info(`Topping up energy for ${userId}: ${agent?.agentUrl}`);

      if (process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_TOPUP !== "true") {
        // Don't allow!
        return NextResponse.json(
          {
            error:
              "To enable free debug top-ups, please modify your environment variables.",
          },
          { status: 500 }
        );
      }

      let gameState = await getGameState(agent?.agentUrl);
      await saveGameState(agent?.agentUrl, {
        ...gameState,
        player: { ...(gameState?.player || {}), energy: 100 },
      });
      gameState = await getGameState(agent?.agentUrl);
      return NextResponse.json(gameState);
    } else if (operation == "dump-state") {
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
    } else if (operation == "deplete-energy") {
      log.info(`Depleting energy for ${userId}: ${agent?.agentUrl}`);

      if (process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_DEPLETE !== "true") {
        // Don't allow!
        return NextResponse.json(
          {
            error:
              "To enable debug depletes, please modify your environment variables.",
          },
          { status: 500 }
        );
      }

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
