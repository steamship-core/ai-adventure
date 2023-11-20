"use client";
import { Character } from "@/lib/game/schema/characters";
import { track } from "@vercel/analytics/react";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographySmall } from "../ui/typography/TypographySmall";

const DEFAULT_ADVENTURE = "c15ecc46-833b-4e39-87c1-d97095a14c54";

const CharacterMap = ({
  adventureId,
  characters,
}: {
  adventureId?: string;
  characters: Character[];
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {characters.map((character, i) => {
        const searchParams = new URLSearchParams();
        searchParams.set("genre", character.genre || "");
        searchParams.set("tone", character.tone || "");
        searchParams.set("background", character.background);
        searchParams.set("motivation", character.motivation);
        searchParams.set("description", character.description);
        searchParams.set("name", character.name);
        return (
          <div key={i} className="w-full">
            <a
              href={
                adventureId
                  ? `/adventures/${adventureId}/create-instance?${searchParams.toString()}`
                  : `/adventures/${DEFAULT_ADVENTURE}`
              }
              className="flex h-full text-center w-full relative rounded-md aspect-[1/1] md:aspect-[1/1.5]  overflow-hidden border border-foreground/20 hover:border-indigo-500"
              onClick={() => {
                track("Character Selected", {
                  character: character.name,
                });
              }}
            >
              {character.image ? (
                <Image
                  fill
                  src={character.image}
                  alt={character.name}
                  className="object-cover z-10"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <UserIcon size={64} className="z-10" />
                </div>
              )}
              <div className="z-20 absolute bottom-0 left-0 bg-background/80 w-full">
                <div className="w-full">
                  <TypographySmall>{character.name}</TypographySmall>
                  <TypographyMuted>{character.tagline}</TypographyMuted>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterMap;
