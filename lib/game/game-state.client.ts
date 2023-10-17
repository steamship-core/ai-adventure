import { GameState } from "./schema/game_state";

export const getGameState = async () => {
  const resp = await fetch("/api/game");
  const { gameState } = (await resp.json()) as { gameState: GameState };
  return gameState;
};

export const updateGameState = async (gameState: GameState) => {
  return fetch("/api/agent/update", {
    method: "POST",
    body: JSON.stringify(gameState),
  });
};
