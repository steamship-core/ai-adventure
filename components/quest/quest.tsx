"use client";
import { QuestContainer } from "@/components/quest/shared/components";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";
import { QuestHeader } from "./quest-header";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Block } from "@steamship/client";

export default function Quest({ gameState }: { gameState: GameState }) {
  const [id, setId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Block | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setId(v4());
  }, []);

  const onSummary = (summary: Block) => {
    setSummary(summary);
  };

  const onComplete = () => {
    setIsComplete(true);
  };

  console.log(gameState);

  return (
    <QuestContainer>
      {id && (
        <>
          <QuestHeader
            gameState={gameState}
            id={id}
            summary={summary}
            isComplete={isComplete}
          />
          <QuestNarrative
            id={id}
            onSummary={onSummary}
            onComplete={onComplete}
            isComplete={isComplete}
            summary={summary}
          />
        </>
      )}
    </QuestContainer>
  );
}
