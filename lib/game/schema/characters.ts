import { Item } from "./objects";

export type Character = {
  /** The name of the character. */
  name: string;

  /** The description of the character. */
  description: string;

  /** The background of the character. */
  background: string;

  /** The inventory of the character. */
  inventory: Item[];

  /** The motivation of the character */
  motivation: string;
};

export type NpcCharacter = Character & {
  /** The kind of NPC. Can be 'conversational' or 'merchant' */
  category?: "conversational" | "merchant";

  /** The disposition of the NPC toward the player. 1=doesn't know you. 5=knows you well */
  disposition_toward_player?: number;
};

export type Merchant = NpcCharacter;

export type TravelingMerchant = Merchant;

export type HumanCharacter = Character & {
  /** The rank of the player. Higher rank equals more power */
  rank?: number;

  /** The gold the player has. Gold can be used buy items from the Merchant. Gold is acquired by selling items to the Merchant and after every quest. */
  gold?: number;

  /** The energy the player has. Going on a quest requires and expends energy. This is the unit of monetization for the game. */
  energy?: number;
};
