import { getSteamshipClient } from "../utils";

export const tradeItems = async (
  agentBase: string,
  tradeBody: {
    counter_party: string;
    sell: string[];
    buy: string[];
  }
) => {
  const steamship = getSteamshipClient();
  return steamship.agent.post({
    url: agentBase,
    path: "/trade",
    arguments: tradeBody,
  });
};
