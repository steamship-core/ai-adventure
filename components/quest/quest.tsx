import {
  QuestContainer,
  QuestContentContainer,
} from "@/components/quest/shared/components";
import { Button } from "../ui/button";
import Link from "next/link";
import InventorySheet from "../inventory-sheet";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";

export default async function Quest({ gameState }: { gameState: GameState }) {
  return (
    <QuestContainer>
      <div className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
        <Button asChild variant="link" className="pl-0">
          <Link href="/play/camp">Back to Camp</Link>
        </Button>
        <InventorySheet gameState={gameState} />
      </div>
      <QuestNarrative />
    </QuestContainer>
  );
}
