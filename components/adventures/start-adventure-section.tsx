"use client";

import { Adventure } from "@prisma/client";
import { PlayIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { AdventureDescription } from "./adventure-description";
import CharacterTemplatesSection from "./character-templates-section";

export const StartAdventureSection = ({
  adventure,
}: {
  adventure: Adventure;
}) => {
  return (
    <div className="p-4 md:p-6 flex gap-6 flex-col">
      <div className="flex flex-col gap-4">
        <TypographyH1>{adventure.name}</TypographyH1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="text-white bg-indigo-500 hover:bg-indigo-700 p-6 text-2xl flex gap-2 w-full">
              <PlayIcon />
              Start adventure
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <CharacterTemplatesSection adventure={adventure} />
          </SheetContent>
        </Sheet>
        <TypographyLarge className="mt-2 text-xl">
          {adventure.shortDescription}
        </TypographyLarge>
        <AdventureDescription description={adventure.description} />
        <CharacterTemplatesSection adventure={adventure} />
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
