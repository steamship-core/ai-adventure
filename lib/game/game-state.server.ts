import { getSteamshipClient } from "../utils";
import { GameState } from "./schema/game_state";

export const getGameState = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.agent.get({
    url: agentBase,
    path: "/game_state",
    arguments: {},
  });
  const body = await userSettings.json();
  return body as GameState;
};

export const saveGameState = async (
  agentBase: string,
  gameState: GameState
) => {
  const steamship = getSteamshipClient();
  return await steamship.agent.post({
    url: agentBase,
    path: "/game_state",
    arguments: gameState,
  });
};
