import { log } from "next-axiom";
import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  console.log(`Making completeOnboarding call to ${agentBase}`);
  log.info(`Making completeOnboarding call to ${agentBase}`);
  const res = await steamship.agent.post({
    url: agentBase,
    path: "/complete_onboarding",
    arguments: {},
  });
  return res;
};
