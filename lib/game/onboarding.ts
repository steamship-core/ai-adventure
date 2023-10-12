import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (apiBase: string) => {
  const steamship = getSteamshipClient(apiBase);
  return await steamship.post(`/complete_onboarding`, {});
};
