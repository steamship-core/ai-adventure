import { GameState } from "@/lib/game/schema/game_state";
import { AlertTriangle } from "lucide-react";
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
  const ref = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string | null>(null);

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
