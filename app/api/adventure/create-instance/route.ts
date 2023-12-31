import { getAdventure } from "@/lib/adventure/adventure.server";
import { createAgent } from "@/lib/agent/agent.server";
import { anonAuth } from "@/lib/anon-auth/anon-auth-server";
import prisma from "@/lib/db";
import { sendAdventureMilestoneEmail } from "@/lib/emails/adventure-creation";
import { getGameState } from "@/lib/game/game-state.server";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAxiom(async (request: NextRequest) => {
  let { userId } = auth();
  if (!userId) {
    if (!(process.env.NEXT_PUBLIC_ALLOW_NOAUTH_GAMEPLAY === "true")) {
      // We aren't permitting un-authedgameplay.
      log.error("No user");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      let resp = await anonAuth(request);
      userId = resp.userId || null;
      if (!userId) {
        log.error("No anon user session. Unable to create instance.");
        return NextResponse.json(
          { error: "No anon user session. Unable to create instance." },
          { status: 404 }
        );
      } else {
        console.log(`create-instance got anon user ${userId}`);
      }
    }
  }

  // At this point the userId could be the clerk Id or the anon|uuid id.

  try {
    let { adventureId, isDevelopment, gameState } = await request.json();

    const adventure = await getAdventure(adventureId);
    if (!adventure) {
      log.error("No Adventure - redirecting to /adventures");
      return NextResponse.json(
        { error: `AdventureId ${adventureId}` },
        { status: 404 }
      );
    }

    const useAvailableAgentCache = true;

    const agent = await createAgent(
      userId,
      adventureId,
      isDevelopment,
      useAvailableAgentCache,
      gameState
    );

    if (!agent) {
      log.error("No agent - redirecting to /adventures");
      return NextResponse.json(
        { error: `No agent - redirecting to /adventures` },
        { status: 404 }
      );
    }

    if (adventure.creatorId !== userId) {
      // Count the agents for this adventure and not the creator
      const count = await prisma.agents.count({
        where: {
          AND: {
            adventureId: adventureId,
            ownerId: { not: adventure.creatorId },
          },
        },
      });
      sendAdventureMilestoneEmail(adventure, count);
    }

    // Finally, we redirect either to camp or to the character-creation based on whether we're in fast-create mode.

    const newGameState = await getGameState(agent.agentUrl);

    if (newGameState) {
      if (newGameState.active_mode == "quest") {
        return NextResponse.json(
          { url: `/play/${agent.handle}/quest/${newGameState.current_quest}` },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { url: `/play/${agent.handle}/camp` },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        { url: `/play/${agent.handle}/character-creation` },
        { status: 200 }
      );
    }
  } catch (ex) {
    console.log(ex);
    log.error(`${ex}`);
    return NextResponse.json({ error: `Exception ${ex}` }, { status: 500 });
  }
});
