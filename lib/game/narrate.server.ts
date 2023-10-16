import { getSteamshipClient } from "../utils";

export const narrate = async (agentBase: string, blockId: string) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/narrate_block",
    arguments: { block_id: blockId },
  });
  return await resp.json();
};
