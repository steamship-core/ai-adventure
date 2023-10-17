import { getSteamshipClient } from "../utils";

export const updateInventory = async (agentBase: string, npc_name: string) => {
  const steamship = getSteamshipClient();
  try {
    const resp = await steamship.agent.post({
      url: agentBase,
      path: "/refresh_inventory",
      arguments: { npc_name },
    });
    return await resp.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
