import { Camp } from "./camp";
import { HumanCharacter } from "./characters";
import { Quest } from "./quest";

export type GameState = {
  player: HumanCharacter;

  /** The tone of the story being told */
  tone: string;

  /** The genre of the story being told */
  genre: string;

  /** The quests the player has been on */
  quests: Quest[];

  /** The player's camp. This is where they are when they're not on a quest. */
  camp: Camp;

  /** Set this to a quest chat_file_id in order to signal that the player is on that quest right now. */
  current_quest?: string;

  /** Set this to a player name in order to signal that the player is chatting with that person right now. */
  in_conversation_with?: string;

  /** For agent-side use. Indicates the agent is awaiting an answer to a specific question keyed by this value. */
  await_ask_key?: string;
};
