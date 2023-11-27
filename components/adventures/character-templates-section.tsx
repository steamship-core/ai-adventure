"use client";
import { Button } from "@/components/ui/button";
import { amplitude } from "@/lib/amplitude";
import { Character } from "@/lib/game/schema/characters";
import { Adventure } from "@prisma/client";
import Link from "next/link";
import ErrorBoundary from "../error-boundary";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import CharacterMap from "./character-map";

const getAgentConfig = (adventure: Adventure) => {
  if (!adventure?.agentConfig) return null;
  return adventure.agentConfig as {
    characters?: Character[];
    adventure_player_singular_noun?: string;
  };
};

const CharacterTemplatesSection = ({ adventure }: { adventure: Adventure }) => {
  const characters = getAgentConfig(adventure)?.characters || [];
  const playerSingularNoun =
    getAgentConfig(adventure)?.adventure_player_singular_noun || "Player";

  const hasPremadeCharacters = characters.length > 0;

  const createDescription = hasPremadeCharacters ? (
    <TypographyMuted className="text-lg">
      Create a custom {playerSingularNoun.toLocaleLowerCase()} whose profile
      will influence gameplay and outcomes.
    </TypographyMuted>
  ) : (
    <TypographyMuted className="text-lg">
      The profile you choose will influence gameplay and outcomes.
    </TypographyMuted>
  );
  console.log(adventure);
  const onClick = () => {
    amplitude.track("Button Click", {
      buttonName: "Start Adventure",
      location: "Adventure",
      action: "start-adventure",
      adventureId: adventure.id,
      templateCharacter: false,
    });
  };
  return (
    <>
      {hasPremadeCharacters && (
        <ErrorBoundary>
          <div className="mt-6">
            <TypographyH2 className="border-none">
              Choose your {playerSingularNoun}
            </TypographyH2>
            <div className="mt-2  max-w-4xl">
              <CharacterMap
                characters={characters}
                adventureId={adventure.id}
              />
            </div>
          </div>
        </ErrorBoundary>
      )}
      <div className="mt-6">
        <TypographyH2 className="border-none">
          Create a {playerSingularNoun.toLocaleLowerCase()}
        </TypographyH2>
        {createDescription}
        <div className="mt-2">
          <Button asChild className="text-xl py-6 px-6 mt-2" onClick={onClick}>
            <Link href={`/adventures/${adventure.id}/create-instance`}>
              Create a {playerSingularNoun.toLocaleLowerCase()}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CharacterTemplatesSection;
