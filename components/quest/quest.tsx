"use client";
import { QuestContainer } from "@/components/quest/shared/components";
import { GameState } from "@/lib/game/schema/game_state";
import { Block } from "@/lib/streaming-client/src";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InGameNavigation } from "../navigation/in-game-navigation";
import QuestNarrative from "./quest-narrative";

export default function Quest({
  gameState,
  agentBaseUrl,
  workspaceHandle = "",
  gameEngineVersion = "",
  isDevelopment = false,
  agentHandle,
  adventureId,
}: {
  gameState: GameState;
  agentBaseUrl: string;
  isDevelopment: boolean;
  gameEngineVersion?: string;
  workspaceHandle?: string;
  agentHandle: string;
  adventureId?: string;
}) {
  const [summary, setSummary] = useState<Block | null>(null);
  const { questId } = useParams();
  const quest = gameState?.quests?.find((q) => q.name === questId);
  const [didFail, setFailed] = useState(false);
  const questArcs = gameState?.quest_arc || [];
  const questIndex = gameState?.quests?.findIndex((q) => q.name === questId);
  const questArc = questIndex > questArcs.length ? null : questArcs[questIndex];

  const [isComplete, setIsComplete] = useState(
    quest?.text_summary ? true : false
  );
  const [completeButtonText, setCompleteButtonText] = useState<string>(
    quest?.text_summary ? "See Quest Results" : "Complete Quest"
  );

  const onSummary = (summary: Block) => {
    setSummary(summary);
  };

  const onComplete = (failed?: boolean) => {
    setIsComplete(true);
    setFailed(failed || false);
  };

  useEffect(() => {
    if (gameState?.active_mode != "quest") {
      // If we're not in a quest, then we don't need to do anything.
      // Here we override the "Complete Quest" label since it's historical.
      setCompleteButtonText("See Quest Results");
      setIsComplete(true);
    }
  }, [gameState?.active_mode]);

  return (
    <QuestContainer>
      {questId && (
        <>
          <InGameNavigation
            title={questArc?.location ? questArc.location : "Unknown Location"}
            subtitle={questArc?.goal ? questArc.goal : "Unknown Goal"}
            isDevelopment={false}
            showEnergy={false}
            workspaceHandle={workspaceHandle}
            gameEngineVersion={gameEngineVersion || "unknown"}
            className="mb-2"
          />
          <QuestNarrative
            id={questId as string}
            onSummary={onSummary}
            onComplete={onComplete}
            isComplete={isComplete}
            didFail={didFail}
            summary={summary}
            agentBaseUrl={agentBaseUrl}
            completeButtonText={completeButtonText}
            agentHandle={agentHandle}
            adventureId={adventureId}
          />
        </>
      )}
    </QuestContainer>
  );
}
