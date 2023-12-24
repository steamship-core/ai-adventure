import { GameState } from "@/lib/game/schema/game_state";
import { useRef } from "react";
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
            Start {adventureSingleNounLc}
          </Button>
        </CreationActions>
      </CreationContent>
    </div>
  );
};

export default CharacterCreationComplete;
