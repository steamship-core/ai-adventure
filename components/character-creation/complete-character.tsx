import { getGameState, updateGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import useLoadingScreen from "../loading/use-loading-screen";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { CreationActions, CreationContent } from "./shared/components";

const allValuesAreSet = (config: CharacterConfig) => {
  return (
    config.player?.name &&
    config.player?.description &&
    config.player?.background
  );
};

export type CharacterConfig =
  | Partial<GameState> & {
      player: Partial<GameState["player"]>;
    };

const CharacterCreationComplete = ({
  config,
  isCurrent,
  isCompleteConfig,
  editCharacterFromTemplate,
  setActiveStep,
}: {
  config: CharacterConfig;
  isCurrent: boolean;
  isCompleteConfig: boolean;
  editCharacterFromTemplate: () => any;
  setActiveStep: Dispatch<SetStateAction<number>>;
}) => {
  const { loadingScreen, setIsVisible } = useLoadingScreen(
    "Building your AI generated adventure. This may take a minute..."
  );
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ handle: string }>();

  const pollForAgentSideOnboardingComplete = async () => {
    // Call getGameState once every second until the game state is no longer onboarding
    // or an error occurs. Attempt this for 3 minutes.
    let count = 0;
    const interval = setInterval(async () => {
      count += 1;
      console.log(`polling for agent side onboarding complete count: ${count}`);
      const gameState = await getGameState(params.handle);
      let isError = false;
      if (count > 180) {
        clearInterval(interval);
        isError = gameState.active_mode !== "error" ? false : true;
      } else {
        isError = gameState.active_mode === "error";
      }
      if (isError) {
        const whatHappened = encodeURIComponent(
          "Your game has transitioned to an irrecoverable error state."
        );
        const whatYouCanDo = encodeURIComponent(
          "Try creating a new game. We're sorry this happened!"
        );
        const technicalDetails = encodeURIComponent(
          gameState?.unrecoverable_error || "Unknown"
        );
        router.push(
          `/error?whatHappened=${whatHappened}&whatYouCanDo=${whatYouCanDo}&technicalDetails=${technicalDetails}`
        );
      } else if (gameState.active_mode !== "onboarding") {
        clearInterval(interval);
        router.push(`/play/${params.handle}/camp`);
      }
    }, 2000);
  };

  const onComplete = async () => {
    setIsVisible(true);
    try {
      let start = Date.now();
      await updateGameState(config as GameState, params.handle);
      let end = Date.now();
      console.log(`updateGameState took ${end - start}ms`);
      start = Date.now();
      const res = await fetch(
        `/api/agent/${params.handle}/completeOnboarding`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      end = Date.now();
      console.log(`completeOnboarding took ${end - start}ms`);
      if (!res.ok) {
        let url = new URL(
          `${window.location.protocol}//${window.location.hostname}/error`
        );
        url.searchParams.append("technicalDetails", await res.text());
        url.searchParams.append(
          "whatHappened",
          "We were unable to complete your adventure onboarding."
        );
        router.push(url.toString());
      } else {
        pollForAgentSideOnboardingComplete();
      }
    } catch (e) {
      let url = new URL("/error");
      url.searchParams.append("technicalDetails", `Exception: ${e}`);
      url.searchParams.append(
        "whatHappened",
        "We were unable to complete your adventure onboarding: an exception was thrown while trying to complete onboarding."
      );
      router.push(url.toString());
    }
  };

  return (
    <div className="w-full items-start">
      {loadingScreen}
      <CreationContent isCurrent={isCurrent}>
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <TypographyMuted className="text-muted-foreground">
              Name:
            </TypographyMuted>
            <TypographyLarge className="whitespace-break-spaces">
              {config.player?.name}
            </TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Background:</TypographyMuted>
            <TypographyLarge className="whitespace-break-spaces">
              {config.player.background}
            </TypographyLarge>
          </div>
          <div>
            <TypographyMuted>Appearance:</TypographyMuted>
            <TypographyLarge className="whitespace-break-spaces">
              {config.player.description}
            </TypographyLarge>
          </div>
        </div>

        <CreationActions isFinished={true}>
          <Button
            className="w-full"
            onClick={() => setActiveStep(1)}
            ref={ref}
            variant="outline"
          >
            Edit Character
          </Button>
          <Button
            disabled={!allValuesAreSet(config)}
            className="w-full"
            autoFocus
            onClick={onComplete}
            ref={ref}
          >
            Start Adventure
          </Button>
          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Failed to create character</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CreationActions>
      </CreationContent>
    </div>
  );
};

export default CharacterCreationComplete;
