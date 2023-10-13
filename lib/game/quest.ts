import Steamship from "@/lib/streaming-client/src";
import { getSteamshipClient } from "../utils";
import { GameState } from "./schema/game_state";
import { Quest } from "./schema/quest";

export const startQuest = async (apiBase: string) => {
  const steamship = getSteamshipClient(apiBase);
  const resp = await steamship.post(`/start_quest`, {});
  const quest = await resp.json();
  return quest as Quest;
};
