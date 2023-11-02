"use client";
import { Button } from "@/components/ui/button";
import { Character } from "@/lib/game/schema/characters";
import Link from "next/link";
import { useEffect, useState } from "react";
import ErrorBoundary from "../error-boundary";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import CharacterMap from "./character-map";

const CharacterTemplatesSection = ({
  adventureId,
  playerSingularNoun = "Player",
}: {
  adventureId: string;
  playerSingularNoun: string;
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
    <>
      <ErrorBoundary>
        <div className="mt-6">
          <TypographyH2 className="border-none">
            Choose your {playerSingularNoun}
          </TypographyH2>
          <div className="mt-2  max-w-4xl">
            <CharacterMap characters={characters} adventureId={adventureId} />
          </div>
        </div>
      </ErrorBoundary>
      <div className="mt-6">
        <TypographyH2 className="border-none">
          Create your own {playerSingularNoun.toLocaleLowerCase()}
        </TypographyH2>
        <TypographyMuted className="text-lg">
          Create a custom {playerSingularNoun.toLocaleLowerCase()} whose profile
          will influence gameplay and outcomes.
        </TypographyMuted>
        <div className="mt-2">
          <Button asChild className="text-xl py-6 px-6 mt-2">
            <Link href={`/adventures/${adventureId}/create-instance`}>
              Create a {playerSingularNoun.toLocaleLowerCase()}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CharacterTemplatesSection;
