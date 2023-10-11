import { QuestContainer } from "@/components/quest/shared/components";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";
import { QuestHeader } from "./quest-header";
import { useId } from "react";

export default function Quest({ gameState }: { gameState: GameState }) {
  const id = useId();
  return (
    <QuestContainer>
      <QuestHeader gameState={gameState} id={id} />
      <QuestNarrative id={id} />
    </QuestContainer>
  );
}
