import { CUSTOM_CHARACTER_NAME } from "@/lib/characters";
import { Adventure } from "@prisma/client";
import { Character } from "../game/schema/characters";

export const getAgentConfig = (adventure: Adventure) => {
  if (!adventure?.agentConfig) return null;
  return adventure.agentConfig as {
    characters?: Character[];
    adventure_player_singular_noun?: string;
    forbid_custom_characters?: boolean;
    skip_character_selection?: boolean;
    adventure_singular_noun?: string;
  };
};

export const usePlayerSingularNoun = (adventure: Adventure): String => {
  return getAgentConfig(adventure)?.adventure_player_singular_noun || "Player";
};

export const useAdventureSingleNoun = (adventure: Adventure): string => {
  return getAgentConfig(adventure)?.adventure_singular_noun || "Adventure";
};

export const shouldSkipCharacterSelection = (adventure: Adventure): boolean => {
  return getAgentConfig(adventure)?.skip_character_selection === true;
};

export const DEFAULT_CHARACTER = {
  name: "Player",
  description: "An ordinary person.",
  background: "The main character.",
  tagline: "The main character",
} as Character;

export const getAdventureCharacters = (adventure: Adventure): Character[] => {
  const config = getAgentConfig(adventure);

  if (!config) return [];

  const skipCharacterSelection = config.skip_character_selection === true;

  const characters = config.characters || [];

  // If we're skipping character selection, we'll add a hard-coded one at the end in case
  // the game didn't have one already created.
  const diyCharacter = skipCharacterSelection
    ? DEFAULT_CHARACTER
    : ({
        name: CUSTOM_CHARACTER_NAME,
        tagline: "Create your own character",
        custom: true,
      } as Character);

  const premadeCharactersExist = characters.length > 0;

  const noCustomCharacter =
    config.forbid_custom_characters === true && premadeCharactersExist;

  const customCharacterOffer =
    noCustomCharacter && characters.length > 0 ? [] : [diyCharacter];

  const returnCharacters = [
    // @ts-ignore
    ...(characters || []),
    // @ts-ignore
    ...customCharacterOffer,
  ];

  return returnCharacters;
};
