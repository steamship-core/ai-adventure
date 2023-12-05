import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const res = await steamship.agent.post({
    url: agentBase,
    path: "/complete_onboarding",
    arguments: {},
  });
  console.log(res);
  return res;
};
