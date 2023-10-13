import Steamship from "@steamship/client";

const GET = async (req: Request, context: { params: any }) => {
  const blockId = context.params.blockId;
  const steamship = new Steamship({
    apiKey: process.env.STEAMSHIP_API_KEY,
    appBase: "https://apps.staging.steamship.com/",
    apiBase: "https://api.staging.steamship.com/api/v1/",
  });

  const response = await steamship.block.raw({ id: blockId });
  return response;
};

export { GET };
