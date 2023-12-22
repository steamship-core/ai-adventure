"use client";
import { QuestContainer } from "@/components/quest/components";
import { useGameState } from "@/lib/recoil-utils";
import { useParams } from "next/navigation";
import Chat from "../chat";
import { InGameNavigation } from "../navigation/in-game-navigation";

export default function Quest({
  agentBaseUrl,
  workspaceHandle = "",
  gameEngineVersion = "",
  isDevelopment = false,
  agentHandle,
  adventureId,
}: {
  agentBaseUrl: string;
  isDevelopment: boolean;
  gameEngineVersion?: string;
  workspaceHandle?: string;
  agentHandle: string;
  adventureId?: string;
}) {
  const { questId } = useParams();
  const params = useParams<{ handle: string }>();

  const { gameState } = useGameState(params.handle);

  const questArcs = gameState?.quest_arc || [];
  const questIndex = gameState?.quests?.findIndex((q) => q.name === questId);
  const questArc = questIndex > questArcs.length ? null : questArcs[questIndex];

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
          <Chat
            id={questId as string}
            agentBaseUrl={agentBaseUrl}
            agentHandle={agentHandle}
            adventureId={adventureId}
          />
        </>
      )}
    </QuestContainer>
  );
}
