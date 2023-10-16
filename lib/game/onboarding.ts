import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  console.log("Try to complete on boarding", agentBase);
  const res = await steamship.agent.post({
    url: agentBase,
    path: "/complete_onboarding",
    arguments: {},
  });
  if (!res.ok) {
    console.log("Complete onboarding not ok");
    console.log(await res.text());
  } else {
    console.log("Compelte onboarding: ", res.ok);
  }
  return res;
};
