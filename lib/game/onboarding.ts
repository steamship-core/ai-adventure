import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  return await steamship.agent.post({
    url: agentBase,
    path: "/complete_onboarding",
    arguments: {},
  });
};
