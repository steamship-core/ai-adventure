"use client";
import { Character } from "@/lib/game/schema/characters";
import { Adventure } from "@prisma/client";
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

  return (
    <>
      <div className="mt-6 flex flex-col w-full h-full items-center justify-center gap-8 ">
        <div className="text-center">
          <TypographyH2 className="border-none">
            Choose your {playerSingularNoun.toLocaleLowerCase()}
          </TypographyH2>
          <TypographyMuted className="text-lg">
            Select or create a {playerSingularNoun.toLocaleLowerCase()} whos
            profile will influence gameplay and outcomes.
          </TypographyMuted>
        </div>
        <div className="overflow-auto max-h-[50vh]">
          <CharacterMap
            characters={[
              // @ts-ignore
              ...(characters || []),
              // @ts-ignore
              {
                name: "Custom Character",
                tagline: "Create your own character",
              },
            ]}
            adventureId={adventure.id}
          />
        </div>
      </div>
    </>
  );
};

export default CharacterTemplatesSection;
