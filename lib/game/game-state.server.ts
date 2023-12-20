import { log } from "next-axiom";
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
  log.info("Attempting get steamship");
  const steamship = getSteamshipClient();
  log.info("Attempting get agent");
  return await steamship.agent.post({
    url: agentBase,
    path: "/game_state",
    arguments: gameState,
  });
};

export function gameStateSupportsCompletingOnboarding(gameState: GameState) {
  return (
    typeof gameState?.player?.name != "undefined" &&
    typeof gameState?.player?.description != "undefined" &&
    typeof gameState?.player?.background != "undefined"
  );
}
