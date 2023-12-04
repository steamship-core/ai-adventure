"use client";
import { Character } from "@/lib/game/schema/characters";
import { cn } from "@/lib/utils";
import PlayAsCharacterCard from "./play-character-card";

const CharacterMap = ({
  adventureId,
  characters,
}: {
  adventureId?: string;
  characters: Character[];
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
        return (
          <PlayAsCharacterCard
            key={i}
            adventureId={adventureId}
            title={character.name || ""}
            description={character.tagline || ""}
            image={character.image!}
            variant="adventure"
            onboardingParams={{
              name: character.name,
              description: character.description,
              background: character.background,
            }}
          />
        );
        // return (
        //   <div key={i} className="w-full h-72">
        //     <a
        //       href={
        //         adventureId
        //           ? `/adventures/${adventureId}/create-instance?${searchParams.toString()}`
        //           : `/adventures/${DEFAULT_ADVENTURE}`
        //       }
        //       className="flex h-full text-center w-full relative rounded-md aspect-[1/1] md:aspect-[1/1.5]  overflow-hidden border border-foreground/20 hover:border-indigo-500"
        //       onClick={() => {
        //         amplitude.track("Button Click", {
        //           buttonName: "Start Adventure",
        //           location: "Adventure",
        //           action: "start-adventure",
        //           adventureId: adventureId,
        //           templateCharacter: true,
        //         });
        //         track("Character Selected", {
        //           character: character.name,
        //         });
        //       }}
        //     >
        //       {character.image ? (
        //         <Image
        //           fill
        //           src={character.image}
        //           alt={character.name}
        //           className="object-cover z-10"
        //         />
        //       ) : (
        //         <div className="flex items-center justify-center w-full h-full">
        //           <UserIcon size={64} className="z-10" />
        //         </div>
        //       )}
        //       <div className="z-20 absolute bottom-0 left-0 bg-background/80 w-full">
        //         <div className="w-full">
        //           <TypographySmall>{character.name}</TypographySmall>
        //           <TypographyMuted>{character.tagline}</TypographyMuted>
        //         </div>
        //       </div>
        //     </a>
        //   </div>
        // );
      })}
    </div>
  );
};

export default CharacterMap;
