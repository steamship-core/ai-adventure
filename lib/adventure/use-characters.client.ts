"use client";

import { CUSTOM_CHARACTER_NAME } from "@/lib/characters";
import { Adventure } from "@prisma/client";
import { Character } from "../game/schema/characters";

export const useAgentConfig = (adventure: Adventure) => {
  if (!adventure?.agentConfig) return null;
  return adventure.agentConfig as {
    characters?: Character[];
    adventure_player_singular_noun?: string;
    forbid_custom_characters?: boolean;
    adventure_singular_noun?: string;
  };
};

export const usePlayerSingularNoun = (adventure: Adventure) => {
  return useAgentConfig(adventure)?.adventure_player_singular_noun || "Player";
};

export const useAdventureSingleNoun = (adventure: Adventure) => {
  return useAgentConfig(adventure)?.adventure_singular_noun || "Adventure";
};

export const useAdventureCharacters = (adventure: Adventure): Character[] => {
  const config = useAgentConfig(adventure);

  if (!config) return [];

  const characters = config.characters || [];

  const premadeCharactersExist = characters.length > 0;

  const noCustomCharacter =
    config.forbid_custom_characters === true && premadeCharactersExist;

  const customCharacterOffer = noCustomCharacter
    ? []
    : [
        {
          name: CUSTOM_CHARACTER_NAME,
          tagline: "Create your own character",
          custom: true,
        } as Character,
      ];

  return [
    // @ts-ignore
    ...(characters || []),
    // @ts-ignore
    ...customCharacterOffer,
  ];
};
