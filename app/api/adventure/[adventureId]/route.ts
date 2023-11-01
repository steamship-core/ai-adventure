import { getAdventure } from "@/lib/adventure/adventure.server";
import { JsonObject } from "@prisma/client/runtime/library";
import { log } from "next-axiom";
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
  };

  return NextResponse.json(ret, { status: 201 });
};
