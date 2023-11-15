import { getSteamshipClient } from "@/lib/utils";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

// GET raw data from block
const GET = async (req: Request, context: { params: any }) => {
  const { blockId, workspaceId } = context.params;

  if (!blockId) {
    return NextResponse.json(
      {
        error: `Unable to fetch block for null blockId`,
      },
      { status: 500 }
    );
  }

  if (!workspaceId) {
    return NextResponse.json(
      {
        error: `Unable to fetch block for null workspaceId`,
      },
      { status: 500 }
    );
  }

  log.info(`/api/block/${blockId}/meta/${workspaceId}`);

  const steamship = await getSteamshipClient().switchWorkspace({
    workspaceId,
  });

  const block = await steamship.block.get({ id: blockId });

  if (typeof block == "undefined" || !block) {
    return NextResponse.json(
      {
        error: `Got undefined block (id=${blockId}) back from workspace ${workspaceId}.`,
      },
      { status: 500 }
    );
  }

  // Fix because sometimes it's lacking it.
  if (!block.workspaceId) {
    block.workspaceId = workspaceId;
  }
  return NextResponse.json(block);
};

export { GET };
