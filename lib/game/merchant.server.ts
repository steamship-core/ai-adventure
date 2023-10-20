import { getSteamshipClient } from "../utils";

export const updateInventory = async (agentBase: string, npc_name: string) => {
  const steamship = getSteamshipClient();
  try {
    return steamship.agent.post({
      url: agentBase,
      path: "/refresh_inventory",
      arguments: { npc_name },
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};
