import { TypographyP } from "../ui/typography/TypographyP";
import { Button } from "../ui/button";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { CreationActions, CreationContent } from "./shared/components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { useTypeWriter } from "./hooks/use-typewriter";
import { useRouter } from "next/navigation";
import { GameState } from "@/lib/game/schema/game_state";
import useLoadingScreen from "../loading/use-loading-screen";

const allValuesAreSet = (config: CharacterConfig) => {
  return (
    config.player?.name &&
    config.player?.description &&
    config.player?.background &&
    config.genre
  );
};

const TEXT = `Creating an image of your character...`;

export type CharacterConfig =
  | Partial<GameState> & {
      player: Partial<GameState["player"]>;
    };

const CharacterCreationComplete = ({
  config,
  isCurrent,
  onFocus,
}: {
  config: CharacterConfig;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { currentText } = useTypeWriter({
    text: TEXT,
  });
  const { loadingScreen, setIsVisible } = useLoadingScreen();

  const [imageLoaded, setImageLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const onComplete = async () => {
    setIsVisible(true);
    let resp = await fetch("/api/agent/update", {
      method: "POST",
      body: JSON.stringify(config),
    });
    resp = await fetch("/api/agent/completeOnboarding", {
      method: "POST",
      body: JSON.stringify({}),
    });
    router.push("/play/camp");
  };

  return (
    <>
      {loadingScreen}
      <CreationContent isCurrent={isCurrent} onClick={onFocus}>
        <div>
          <TypographyP>{currentText}</TypographyP>
        </div>
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
            <TypographyLarge>{config.player?.name}</TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Theme:</TypographyMuted>
            <TypographyLarge>{config.genre}</TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Tone:</TypographyMuted>
            <TypographyLarge>{config.tone}</TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Background:</TypographyMuted>
            <TypographyLarge>{config.player.background}</TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Appearance:</TypographyMuted>
            <TypographyLarge>{config.player.description}</TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Motivation:</TypographyMuted>
            <TypographyLarge>{config.player.motivation}</TypographyLarge>
          </div>
        </div>

        <CreationActions isFinished={true}>
          <Button
            disabled={!allValuesAreSet(config)}
            className="w-full"
            onClick={onComplete}
          >
            Create Character
          </Button>
        </CreationActions>
      </CreationContent>
    </>
  );
};

export default CharacterCreationComplete;
