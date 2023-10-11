import { QuestContainer } from "@/components/quest/shared/components";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";
import { QuestHeader } from "./quest-header";

export default function Quest({ gameState }: { gameState: GameState }) {
  return (
    <QuestContainer>
      <QuestHeader gameState={gameState} />
      <QuestNarrative />
    </QuestContainer>
  );
}
