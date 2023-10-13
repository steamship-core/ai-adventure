"use client";

import { useRecoilValue } from "recoil";
import InteractionSheet from "../interaction-sheet";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographySmall } from "../ui/typography/TypographySmall";
import { recoilGameState } from "../recoil-provider";
import { ContentBox } from "./content-box";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

export const CampMembers = () => {
  const gameState = useRecoilValue(recoilGameState);

  return (
    <>
      {gameState?.camp?.npcs?.length > 0 && (
        <>
          <TypographyMuted className="mb-2">Camp Members</TypographyMuted>
          <div className="flex gap-2 flex-wrap">
            {gameState?.camp?.npcs.map((member) => (
              <InteractionSheet member={member} key={member.name} />
            ))}
          </div>
        </>
      )}
      {gameState?.camp?.npcs?.length === 0 && (
        <div className="flex flex-col text-center items-center justify-center w-full h-full mt-4">
          <TypographyP>You have no camp members yet.</TypographyP>
          <TypographySmall>
            Go on some more adventures and you might find some!
          </TypographySmall>
        </div>
      )}
    </>
  );
};
