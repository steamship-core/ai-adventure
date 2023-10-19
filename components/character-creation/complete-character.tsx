import { updateGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useLoadingScreen from "../loading/use-loading-screen";
import { Button } from "../ui/button";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { CreationActions, CreationContent } from "./shared/components";

const allValuesAreSet = (config: CharacterConfig) => {
  return (
    config.player?.name &&
    config.player?.description &&
    config.player?.background &&
    config.genre
  );
};

export type CharacterConfig =
  | Partial<GameState> & {
      player: Partial<GameState["player"]>;
    };

const CharacterCreationComplete = ({
  config,
  isCurrent,
  onFocus,
  isCompleteConfig,
  editCharacterFromTemplate,
}: {
  config: CharacterConfig;
  isCurrent: boolean;
  onFocus: () => any;
  isCompleteConfig: boolean;
  editCharacterFromTemplate: () => any;
}) => {
  const { loadingScreen, setIsVisible } = useLoadingScreen(
    "Building your AI generated adventure. This may take a minute..."
  );
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);

  const onComplete = async () => {
    setIsVisible(true);
    await updateGameState(config as GameState);
    await fetch("/api/agent/completeOnboarding", {
      method: "POST",
      body: JSON.stringify({}),
    });
    router.push("/play/camp");
  };

  return (
    <>
      {loadingScreen}
      <CreationContent isCurrent={isCurrent}>
        <div className="mt-6 flex flex-col gap-4" onClick={onFocus}>
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
            autoFocus
            onClick={onComplete}
            ref={ref}
          >
            Create Character
          </Button>
          {isCompleteConfig && (
            <Button variant="outline" onClick={editCharacterFromTemplate}>
              Edit Character
            </Button>
          )}
        </CreationActions>
      </CreationContent>
    </>
  );
};

export default CharacterCreationComplete;
