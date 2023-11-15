import { getSteamshipClient } from "@/lib/utils";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

// GET raw data from block
const GET = async (req: Request, context: { params: any }) => {
  const { blockId, workspaceId } = context.params.blockId;

  log.info(`/api/block/${blockId}/meta/${workspaceId}`);

  console.log("Workspace", workspaceId);

  const steamship = await getSteamshipClient().switchWorkspace({
    workspaceId,
  });

  const block = await steamship.block.get({ id: blockId });
  console.log("block", block);

  if (typeof block == "undefined") {
    return NextResponse.json(
      { error: `Got undefined value back.` },
      { status: 500 }
    );
  }
  return NextResponse.json(block);
};

export { GET };
