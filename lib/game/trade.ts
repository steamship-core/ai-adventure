import { getSteamshipClient } from "../utils";

export const tradeItems = async (
  apiBase: string,
  tradeBody: {
    counter_party: string;
    sell: string[];
    buy: string[];
  }
) => {
  const steamship = getSteamshipClient(apiBase);
  return await steamship.post(`/trade`, tradeBody);
};
