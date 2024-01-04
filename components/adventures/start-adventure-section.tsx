"use client";

import {
  DEFAULT_CHARACTER,
  getAdventureCharacters,
  getAgentConfig,
  shouldSkipCharacterSelection,
  useAdventureSingleNoun,
} from "@/lib/adventure/use-characters.client";
import { Adventure, UserInfo } from "@prisma/client";
import { PlayIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { AdventureDescription } from "./adventure-description";
import CharacterTemplatesSection from "./character-templates-section";
import { PlayAsCharacterButton } from "./play-character-card";

export const StartAdventureSection = ({
  adventure,
  ownerUserInfo,
}: {
  adventure: Adventure;
  ownerUserInfo: UserInfo | null;
}) => {
  const adventureSingleNoun = useAdventureSingleNoun(adventure);
  const config = getAgentConfig(adventure);
  const skipCharacterSelection = shouldSkipCharacterSelection(adventure);
  const player1 = skipCharacterSelection
    ? { ...DEFAULT_CHARACTER, ...getAdventureCharacters(adventure)[0] }
    : {};

  return (
    <div className="p-4 md:p-6 flex gap-6 flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between flex-col md:flex-row w-full items-start md:items-start gap-2">
          <div>
            <TypographyMuted>{adventureSingleNoun} name</TypographyMuted>
            <TypographyH1>{adventure.name}</TypographyH1>
          </div>
          {ownerUserInfo && (
            <div>
              <TypographyMuted>Created by</TypographyMuted>
              <div className="flex gap-2 items-center">
                {ownerUserInfo?.avatarImage && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={ownerUserInfo.username || "Profile picture"}
                      src={ownerUserInfo.avatarImage}
                      className="rounded-md h-12 w-12"
                    />
                  </>
                )}
                <TypographyH3>{ownerUserInfo.username}</TypographyH3>
              </div>
            </div>
          )}
        </div>

        {skipCharacterSelection ? (
          <PlayAsCharacterButton
            adventureId={adventure?.id}
            onboardingParams={player1}
            fastOnboard={true}
          />
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="text-white bg-indigo-500 hover:bg-indigo-700 p-6 text-2xl flex gap-2 w-full">
                <PlayIcon />
                Start
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <CharacterTemplatesSection adventure={adventure} />
            </SheetContent>
          </Sheet>
        )}

        <TypographyLarge className="mt-2 text-xl">
          {adventure.shortDescription}
        </TypographyLarge>
        <AdventureDescription description={adventure.description} />
        {!skipCharacterSelection && (
          <CharacterTemplatesSection adventure={adventure} />
        )}
      </div>
      {!adventure.agentConfig && (
        <Alert>
          <AlertTitle>This adventure is not finished yet</AlertTitle>
          <AlertDescription>
            This adventure cannot be played yet because it is not yet published.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
