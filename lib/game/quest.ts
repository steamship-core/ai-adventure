import Steamship from "@/lib/streaming-client/src";
import { getSteamshipClient } from "../utils";
import { GameState } from "./schema/game_state";
import { Quest } from "./schema/quest";

export const startQuest = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/start_quest",
    arguments: {},
  });
  const quest = await resp.json();
  return quest as Quest;
};
