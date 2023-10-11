"use client";
import { QuestContainer } from "@/components/quest/shared/components";
import QuestNarrative from "./quest-narrative";
import { GameState } from "@/lib/game/schema/game_state";
import { QuestHeader } from "./quest-header";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function Quest({ gameState }: { gameState: GameState }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(v4());
  }, []);

  return (
    <QuestContainer>
      {id && (
        <>
          <QuestHeader gameState={gameState} id={id} />
          <QuestNarrative id={id} />
        </>
      )}
    </QuestContainer>
  );
}
