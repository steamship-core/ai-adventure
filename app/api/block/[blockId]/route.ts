import { getSteamshipClient } from "@/lib/utils";
import { StreamingTextResponse } from "ai";
import { log } from "next-axiom";

// Post to conform to useCompletion API
const POST = async (req: Request, context: { params: any }) => {
  const blockId = context.params.blockId;
  log.info(`/api/block/${blockId}`);
  const steamship = getSteamshipClient();
  log.info(`client config ${JSON.stringify(steamship.config)}`);
  const response = await steamship.block.raw({ id: blockId });
  if (response.body) {
    return new StreamingTextResponse(response.body);
  }
  throw Error("No response body");
};

// GET raw data from block
const GET = async (req: Request, context: { params: any }) => {
  const blockId = context.params.blockId;
  log.info(`/api/block/${blockId}`);
  const steamship = getSteamshipClient();
  log.info(`client config ${JSON.stringify(steamship.config)}`);
  const response = await steamship.block.raw({ id: blockId });
  log.info(`response ok ${response.ok}`);
  return response;
};

export { GET, POST };
