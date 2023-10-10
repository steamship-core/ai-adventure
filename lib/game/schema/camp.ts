import { HumanCharacter, NpcCharacter } from "./characters";

export type Camp = {
  /** The name of the user's camp */
  name: string;

  /** The NPCs who are at camp */
  npcs: NpcCharacter[];

  /** The human characters that are at camp other than player. */
  human_players: HumanCharacter[];

  /** The chat file id of the camp */
  chat_file_id?: string;
};
