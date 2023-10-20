// GET raw data from block
const GET = async (req: Request, context: { params: any }) => {
  // const blockId = context.params.blockId;
  // log.info(`/api/block/${blockId}`);
  // const steamship = getSteamshipClient();
  // log.info(`client config ${JSON.stringify(steamship.config)}`);
  // const response = await steamship.block.raw({ id: blockId });
  // log.info(`response ok ${response.ok}`);
  // return response;
  return fetch("https://ai-adventure.steamship.com/adventurer.png");
};

export { GET };
