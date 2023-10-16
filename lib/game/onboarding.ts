import { getSteamshipClient } from "../utils";

export const completeOnboarding = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const res = await steamship.agent.post({
    url: agentBase,
    path: "/complete_onboarding",
    arguments: {},
  });
  if (!res.ok) {
    console.log("Complete onboarding not ok");
    console.log(await res.text());
  } else {
    console.log("Completed onboarding: ", res.ok);
  }
  return res;
};
