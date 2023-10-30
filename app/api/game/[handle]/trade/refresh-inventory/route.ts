import { getAgent } from "@/lib/agent/agent.server";
import { getGameState } from "@/lib/game/game-state.server";
import { updateInventory } from "@/lib/game/merchant.server";
import { auth } from "@clerk/nextjs";
import { differenceInHours } from "date-fns";
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

  const { npc_name } = await request.json();

  try {
    let gameState = await getGameState(agent?.agentUrl);
    if (gameState?.active_mode == "onboarding") {
      return NextResponse.json(
        { error: "Cannot update inventory during onboarding" },
        { status: 500 }
      );
    }
    // Update the merchants inventory
    const merchant = gameState?.camp?.npcs?.find(
      (npc) => npc.name === npc_name
    );
    if (merchant) {
      const lastUpdatedAt = merchant.inventory_last_updated;
      if (
        !lastUpdatedAt ||
        differenceInHours(Date.now(), new Date(lastUpdatedAt)) > 12
      ) {
        // No need to wait for this. It will update in the background and the user will see the updated inventory on the next page load
        const res = await updateInventory(agent?.agentUrl, npc_name);
        if (res && res.ok) {
          return NextResponse.json(
            { success: true, updated: true },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: "Failed to update inventory", updated: false },
            { status: 500 }
          );
        }
      }
    }
    return NextResponse.json(
      { success: true, updated: false },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
