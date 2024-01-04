"use client";
import {
  getAdventureCharacters,
  useAdventureSingleNoun,
  usePlayerSingularNoun,
} from "@/lib/adventure/use-characters.client";
import { Adventure } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LoadingScreen from "../loading/loading-screen";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import CharacterMap from "./character-map";

const CharacterTemplatesSection = ({ adventure }: { adventure: Adventure }) => {
  const playerSingularNoun = usePlayerSingularNoun(adventure);
  const adventureSingleNoun = useAdventureSingleNoun(adventure);

  const characters = getAdventureCharacters(adventure);

  const [loading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const isDevelopment = searchParams.get("isDevelopment") === "true";

  return (
    <>
      <div className="mt-6 flex flex-col w-full h-full items-center justify-center gap-8 ">
        <div className="text-center">
          <TypographyH2 className="border-none">
            Choose your {playerSingularNoun.toLocaleLowerCase()}
          </TypographyH2>
          <TypographyMuted className="text-lg">
            Your {playerSingularNoun.toLocaleLowerCase()} profile influences
            gameplay and outcomes.
          </TypographyMuted>
        </div>
        <div className="overflow-auto max-h-[50vh]">
          <CharacterMap
            setIsLoading={setIsLoading}
            isDevelopment={isDevelopment}
            enabled={!loading}
            characters={characters}
            adventureId={adventure.id}
          />
        </div>
      </div>
      {loading && (
        <LoadingScreen title={`Creating ${adventureSingleNoun} ...`} />
      )}
    </>
  );
};

export default CharacterTemplatesSection;
