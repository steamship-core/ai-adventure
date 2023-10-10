import Steamship from "@steamship/client";
import { getSteamshipClient } from "../utils";
import { GameState } from "./schema/game_state";

export const getGameState = async () => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.get(`/game_state`);
  const body = await userSettings.json();
  return body as GameState;
};

export const saveGameState = async (gameState: GameState) => {
  const steamship = getSteamshipClient();
  return await steamship.post(`/game_state`, gameState);
};
