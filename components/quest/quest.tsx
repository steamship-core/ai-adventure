"use client";
import { QuestContainer } from "@/components/quest/shared/components";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";
import { QuestHeader } from "./quest-header";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Block } from "@/lib/streaming-client/src";

export default function Quest({
  gameState,
  agentBaseUrl,
}: {
  gameState: GameState;
  agentBaseUrl: string;
}) {
  const [id, setId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Block | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [completeButtonText, setCompleteButtonText] = useState<string>();

  useEffect(() => {
    setId(v4());
  }, []);

  const onSummary = (summary: Block) => {
    setSummary(summary);
  };

  const onComplete = () => {
    setIsComplete(true);
  };

  useEffect(() => {
    if (gameState.active_mode != "quest") {
      // If we're not in a quest, then we don't need to do anything.
      // Here we override the "Complete Quest" label since it's historical.
      setCompleteButtonText("See Quest Results");
      setIsComplete(true);
    }
  }, [gameState.active_mode]);
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
            agentBaseUrl={agentBaseUrl}
            completeButtonText={completeButtonText}
          />
        </>
      )}
    </QuestContainer>
  );
}
