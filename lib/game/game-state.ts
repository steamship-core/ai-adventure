import Steamship from "@steamship/client";
import { getSteamshipClient } from "../utils";
import { mockGameState, mockPlayer } from "./mocks";

export type Character = {
  name: string;
  description: string;
  background: string;
  inventory: Item[];
  motivation: string;
};

export type HumanCharacter = Character & {
  rank: number;
  gold: number;
  energy: number;
};

export type NpcCharacter = Character & {
  category: string;
  disposition_toward_player: number;
};

export type Item = {
  name: string;
  description: string;
  is_one_time_use: boolean;
  modifier: number;
  picture_url: string;
};

export type Camp = {
  name: string;
  npcs: NpcCharacter[];
  human_players: HumanCharacter[];
  chat_file_id: string | null;
};

export type Quest = {
  originating_string: string;
  name: string;
  description: string;
  chat_file_id: string;
  image_url: string;
  text_summary: string;
  new_items: Item[];
  rank_delta: number;
  camp: Camp;
};

export type GameState = {
  player: HumanCharacter;
  tone: string;
  genre: string;
  quests: Quest[];
  current_quest: string | null;
  camp: Camp;
  in_conversation_with: string | null;
  await_ask_key: string | null;
};

export const getGameState = async () => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.get(`/game_state`);
  const body = await userSettings.json();
  return body as GameState;
};

export const saveGameState = async (gameState: GameState) => {
  const steamship = getSteamshipClient();
  return await steamship.post(`/game_state`, JSON.stringify(gameState));
};
