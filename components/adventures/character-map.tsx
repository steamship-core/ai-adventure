"use client";
import { Character } from "@/lib/game/schema/characters";
import { cn } from "@/lib/utils";
import PlayAsCharacterCard from "./play-character-card";

const CharacterMap = ({
  adventureId,
  characters,
  setIsLoading,
  isDevelopment,
  enabled,
}: {
  adventureId?: string;
  characters: Character[];
  setIsLoading: (isLoading: boolean) => void;
  enabled: boolean;
  isDevelopment: boolean;
}) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        characters.length === 1 && "grid-cols-1",
        characters.length === 2 && "grid-cols-2",
        characters.length >= 3 && "grid-cols-2 md:grid-cols-3 "
      )}
    >
      {characters.map((character, i) => {
        if (!character.name) return null;
        return (
          <PlayAsCharacterCard
            key={i}
            adventureId={adventureId}
            title={character.name || ""}
            description={character.tagline || ""}
            image={character.image!}
            variant="adventure"
            enabled={enabled}
            isDevelopment={isDevelopment}
            fastOnboard={true}
            setIsLoading={setIsLoading}
            onboardingParams={{
              name: character.name,
              description: character.description || "Unknown",
              background: character.background || "Unknown",
            }}
          />
        );
      })}
    </div>
  );
};

export default CharacterMap;
