import Steamship from "@/lib/streaming-client/src";
import { getSteamshipClient } from "@/lib/utils";

const GET = async (req: Request, context: { params: any }) => {
  const blockId = context.params.blockId;
  const steamship = getSteamshipClient();

  const response = await steamship.block.raw({ id: blockId });
  return response;
};

export { GET };
