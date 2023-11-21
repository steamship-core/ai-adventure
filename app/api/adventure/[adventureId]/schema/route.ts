import { getAdventureForUser } from "@/lib/adventure/adventure.server";
import { getSchema } from "@/lib/agent/agent.server";
import { DEPRECATEDSettingGroups } from "@/lib/editor/DEPRECATED-editor-options";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { adventureId: string } }
): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const adventure = await getAdventureForUser(userId, params.adventureId, true);
  if (!adventure) {
    log.error("No adventure");
    return NextResponse.json({ error: "Adventure not found" }, { status: 404 });
  }

  log.info(
    `GET /api/adventure/${adventure.id}/schema which uses Steamship package ${adventure.agentVersion}`
  );
  console.log(
    `GET /api/adventure/${adventure.id}/schema which uses Steamship package ${adventure.agentVersion}`
  );

  if (adventure.agentVersion?.startsWith("1.")) {
    // These are the versions that use the old schema, hard-coded in the agent.
    return NextResponse.json({
      settingGroups: DEPRECATEDSettingGroups,
    });
  }

  // If we're here, then the Agent Version didn't start with `1.`, which means we're using a newer
  // agent that is capable of reporting its own schema to us for rendering, so we have to fetch it.

  // Load the dev agent from the adventure.
  console.log(
    `Using dynamic config. id ${adventure.id}; devAgentId ${adventure.devAgentId}`
  );

  if (!(adventure as any).devAgent) {
    console.log(`No development agent: ${adventure.devAgentId}`);
    log.error("No development agent");
    return NextResponse.json(
      { error: "Adventure's Development agent was not found" },
      { status: 404 }
    );
  }
  const devAgent = (adventure as any).devAgent;
  console.log("Got dev agent.");

  // Get the schema from it.
  const responseJson = await getSchema(devAgent.agentUrl);
  return NextResponse.json(responseJson);
}
