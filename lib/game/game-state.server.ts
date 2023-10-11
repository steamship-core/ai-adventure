import { getSteamshipClient } from "../utils";
import { GameState } from "./schema/game_state";

export const getGameState = async (apiBase: string) => {
  const steamship = getSteamshipClient(apiBase);
  const userSettings = await steamship.get(`/game_state`);
  const body = await userSettings.json();
  return body as GameState;
};

export const saveGameState = async (apiBase: string, gameState: GameState) => {
  const steamship = getSteamshipClient(apiBase);
  return await steamship.post(`/game_state`, gameState);
};
