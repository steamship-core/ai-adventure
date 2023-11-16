import {
  deleteAdventure,
  getAdventure,
  importAdventure,
  publishAdventure,
  updateAdventure,
} from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { JsonObject } from "@prisma/client/runtime/library";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = async (req: Request, context: { params: any }) => {
  const adventureId = context.params.adventureId;
  const adventure = await getAdventure(adventureId);

  if (!adventure) {
    log.error("No adventure");
    return NextResponse.json(
      { error: "Adventure not created" },
      { status: 500 }
    );
  }

  const agentConfig: JsonObject = (adventure.agentConfig || {}) as JsonObject;

  const ret = {
    name: adventure.name,
    description: adventure.description,
    creatorId: adventure.creatorId,
    agentConfig: {
      characters: agentConfig?.characters || [],
    },
    gameEngineVersionAvailable: process.env.STEAMSHIP_AGENT_VERSION,
  };

  return NextResponse.json(ret, { status: 201 });
};

export const POST = withAxiom(async (request: Request) => {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    let { operation, id, data } = await request.json();

    if (operation === "update") {
      const adventure = await updateAdventure(userId, id, data);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation === "delete") {
      const adventure = await deleteAdventure(userId, id);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation === "upgrade") {
      let hardCodedData = {
        game_engine_version: process.env.STEAMSHIP_AGENT_VERSION,
      };
      const adventure = await updateAdventure(userId, id, hardCodedData);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation == "import") {
      data = {
        ...{
          // Defaults
          adventure_name: "Untitled Adventure",
          adventure_description: "Empty Description",
          adventure_short_description: "Empty Short Description",
        },
        ...data,
      };
      const adventure = await importAdventure(userId, id, data);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation == "publish") {
      const adventure = await publishAdventure(userId, id);
      return NextResponse.json(adventure, { status: 200 });
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
