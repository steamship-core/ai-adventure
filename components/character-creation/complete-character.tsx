import GAME_INFO from "@/lib/game-info";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import {
  CreationActions,
  CreationContainer,
  CreationContent,
} from "./utils/components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographySmall } from "../ui/typography/TypographySmall";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { CharacterConfig } from ".";
import { useTypeWriter } from "./utils/use-typewriter";
import Link from "next/link";

const allValuesAreSet = (config: CharacterConfig) => {
  return Object.values(config).every((value) => value.length > 1);
};

const CharacterCreationComplete = ({
  config,
  isCurrent,
  onFocus,
}: {
  config: {
    name: string;
    theme: string;
    background: string;
    appearance: string;
  };
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const characterDescription = `
    Name: ${config.name}
    Theme: ${config.theme}\n
    Background: ${config.background}\n
    Appearance: ${config.appearance}\n
  `;
  const { currentText, isFinished } = useTypeWriter({
    text: `Creating an image of your character...`,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <CreationContent isCurrent={isCurrent} onClick={onFocus}>
      <TypographyP>{currentText}</TypographyP>
      <div className="w-full flex items-center justify-center mt-4">
        <div className="rounded-full overflow-hidden h-44 w-44 border border-yellow-600 shadow-sm shadow-primary">
          {imageLoaded ? (
            <Image
              src={"/orc.png"}
              height={1024}
              width={1024}
              alt="Character"
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <TypographyMuted className="text-muted-foreground">
            Name:
          </TypographyMuted>
          <TypographyLarge>{config.name}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Theme:</TypographyMuted>
          <TypographyLarge>{config.theme}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Background:</TypographyMuted>
          <TypographyLarge>{config.background}</TypographyLarge>
        </div>
        <div>
          <TypographyMuted>Appearance:</TypographyMuted>
          <TypographyLarge>{config.appearance}</TypographyLarge>
        </div>
      </div>

      <CreationActions isFinished={true}>
        <Button disabled={!allValuesAreSet(config)} className="w-full" asChild>
          <Link href="/play/camp">Create Character</Link>
        </Button>
      </CreationActions>
    </CreationContent>
  );
};

export default CharacterCreationComplete;
