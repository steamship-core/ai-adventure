import {
  getAdventureForUser
} from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (request: Request) => {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    let { operation, id, data } = await request.json();

    // Get/create the development agent for this adve   nture

    if (operation === "generate-image") {
      const adventure = await getAdventureForUser(userId, id, true);
      if (adventure == null) {
        throw new Error("No adventure found");
      }

      if (adventure.devAgent == null) {
        throw new Error("No dev agent found for adventure");
      }

      const steamship = getSteamshipClient();
      // See https://docs.steamship.com/javascript_client for information about:
      // - The BASE_URL where your running Agent lives
      // - The context_id which mediates your Agent's server-side chat history

      const task = await steamship.agent.post({
        url: adventure.devAgentId.baseUrl,
        path: "/generate_preview_item_image",
        arguments: {},
      });

      const block = task?.output?.blocks?[0]

      if (!block) {
        throw new Error("No block on response.");
      }

      const blockId = block?.id;

      if (!blockId) {
        throw new Error("No block id.");
      }

      const url = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${blockId}/raw`

      return NextResponse.json({url}, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${operation}.` },
        { status: 500 }
      );
    }
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    return NextResponse.json(
      { error: "Failed to adventure." },
      { status: 404 }
    );
  }
});
