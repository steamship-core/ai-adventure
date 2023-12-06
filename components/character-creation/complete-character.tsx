import { getGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
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

const CharacterCreationComplete = ({ config }: { config: CharacterConfig }) => {
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
  return (
    <div className="w-full items-start">
      <CreationContent>
        <CreationActions isFinished={true}>
          <Button
            disabled={!allValuesAreSet(config)}
            className="w-full"
            autoFocus
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
