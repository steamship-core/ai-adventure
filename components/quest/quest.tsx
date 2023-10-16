"use client";
import { QuestContainer } from "@/components/quest/shared/components";
import { GameState } from "@/lib/game/schema/game_state";
import { Block } from "@/lib/streaming-client/src";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestHeader } from "./quest-header";
import QuestNarrative from "./quest-narrative";

export default function Quest({
  gameState,
  agentBaseUrl,
}: {
  gameState: GameState;
  agentBaseUrl: string;
}) {
  const [summary, setSummary] = useState<Block | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [completeButtonText, setCompleteButtonText] = useState<string>();
  const { questId } = useParams();

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

  return (
    <QuestContainer>
      {questId && (
        <>
          <QuestHeader
            gameState={gameState}
            id={questId as string}
            summary={summary}
            isComplete={isComplete}
          />
          <QuestNarrative
            id={questId as string}
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
