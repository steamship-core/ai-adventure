import { updateGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { useRouter } from "next/navigation";
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
}: {
  config: CharacterConfig;
  isCurrent: boolean;
  onFocus: () => any;
}) => {
  const { loadingScreen, setIsVisible } = useLoadingScreen();
  const router = useRouter();

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
      <CreationContent isCurrent={isCurrent} onClick={onFocus}>
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
