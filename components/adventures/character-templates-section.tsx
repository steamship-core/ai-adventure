"use client";
import { Character } from "@/lib/game/schema/characters";
import { useEffect, useState } from "react";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import CharacterMap from "./character-map";

const CharacterTemplatesSection = ({
  adventureId,
}: {
  adventureId: string;
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  useEffect(() => {
    if (adventureId) {
      const getCharacters = async () => {
        const res = await fetch(`/api/adventure/${adventureId}`);
        if (res.ok) {
          const json = await res.json();
          setCharacters(json?.agentConfig?.characters);
        }
      };
      getCharacters();
    }
  }, [adventureId]);

  // Don't show this section if we don't have any pre-made characters
  if (!characters || !characters.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <TypographyH2 className="border-none">Character Templates</TypographyH2>
      <TypographyMuted className="text-lg">
        Choose from a selection of pre-made characters. Their character details
        are already filled out, so you can jump right into the adventure. If you
        want, you can customize before you start.
      </TypographyMuted>
      <div className="mt-2  max-w-4xl">
        <CharacterMap characters={characters} adventureId={adventureId} />
      </div>
    </div>
  );
};

export default CharacterTemplatesSection;
