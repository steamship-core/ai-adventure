"use client";

import { useRecoilValue } from "recoil";
import InteractionSheet from "../interaction-sheet";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographySmall } from "../ui/typography/TypographySmall";
import { recoilGameState } from "../recoil-provider";

export const CampMembers = () => {
  const gameState = useRecoilValue(recoilGameState);

  return (
    <>
      <TypographyH3>Camp Members</TypographyH3>
      {gameState.camp.npcs.length > 0 && (
        <div className="mt-8 flex">
          {gameState.camp.npcs.map((member) => (
            <InteractionSheet key={member.name} member={member} />
          ))}
        </div>
      )}
      {gameState.camp.npcs.length === 0 && (
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
