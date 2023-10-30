import { GameState } from "./schema/game_state";

export const getGameState = async (handle: string) => {
  const resp = await fetch(`/api/game/${handle}`);
  const { gameState } = (await resp.json()) as { gameState: GameState };
  return gameState;
};

export const updateGameState = async (gameState: GameState, handle: string) => {
  return fetch(`/api/agent/${handle}/update`, {
    method: "POST",
    body: JSON.stringify(gameState),
  });
};
