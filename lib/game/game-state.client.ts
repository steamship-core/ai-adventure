export const getGameState = async () => {
  const resp = await fetch("/api/game");
  const { gameState } = await resp.json();
  return gameState;
};
