import { getAdventureForUser } from "@/lib/adventure/adventure.server";
import { Block } from "@/lib/streaming-client/src";
import { getSteamshipClient } from "@/lib/utils";
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
    const adventure = await getAdventureForUser(userId, id, true);
    if (adventure == null) {
      throw new Error("No adventure found");
    }

    if ((adventure as any).devAgent == null) {
      throw new Error("No dev agent found for adventure");
    }

    const devAgent = (adventure as any).devAgent;

    const steamship = getSteamshipClient();
    // See https://docs.steamship.com/javascript_client for information about:
    // - The BASE_URL where your running Agent lives
    // - The context_id which mediates your Agent's server-side chat history

    let path: string | null = null;

    const devConfig = (adventure.agentDevConfig as any) || {};

    data.unsaved_server_settings = {
      ...devConfig,
      ...(data.unsaved_server_settings || {}),
      short_description:
        data.unsaved_server_settings.adventure_short_description ||
        devConfig.shortDescription,
      description:
        data.unsaved_server_settings.adventure_description ||
        devConfig.description,
      name: data.unsaved_server_settings.adventure_name || devConfig.name,
    };

    if (operation === "preview") {
      path = "/generate_preview";
    } else if (operation === "suggest") {
      path = "/generate_suggestion";
    }

    if (!path) {
      throw new Error(`Unknown operation: ${operation}.`);
    }

    console.log(path, data);

    const response = await steamship.agent.post({
      url: devAgent.agentUrl,
      path,
      arguments: data,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to generate: ${response.status}. ${await response.text()}}`
      );
    }

    const block = (await response.json()) as Block;

    if (typeof block == "undefined" || !block) {
      return NextResponse.json(
        {
          error: `Got back undefined block.`,
        },
        { status: 500 }
      );
    }

    if (!block.workspaceId) {
      block.workspaceId = devAgent.workspaceId;
    }

    return NextResponse.json(block, { status: 200 });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    return NextResponse.json(
      { error: `Failed to generate preview. ${e}` },
      { status: 404 }
    );
  }
});
