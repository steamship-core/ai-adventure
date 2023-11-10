"use client";

import { CharacterSheet } from "@/components/camp/character-sheet";
import { SummaryStats } from "@/components/camp/summary-stats";
import HeaderBackButton from "@/components/header-back-button";
import { PlayTestBanner } from "@/components/status-banners/play-test";

export function InGameNavigation({
  isDevelopment = false,
  workspaceHandle = "",
  gameEngineVersion = "",
  title, // Default: character name and rank
  subtitle, // Default: character energy level
  showEnergy = true,
  showInventory = true,
  showAudio = true,
  className = "",
}: {
  isDevelopment?: boolean;
  workspaceHandle?: string;
  gameEngineVersion?: string;
  title?: string;
  subtitle?: string;
  showEnergy?: boolean;
  showInventory?: boolean;
  showAudio?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {isDevelopment && <PlayTestBanner />}
      <div className="flex flex-row items-center overflow-hidden justify-start gap-4">
        <HeaderBackButton />
        <CharacterSheet
          title={title}
          subtitle={subtitle}
          workspaceHandle={workspaceHandle}
          gameEngineVersion={gameEngineVersion || "unknown"}
          className="flex-1 overflow-hidden"
        />
        <SummaryStats
          showEnergy={showEnergy}
          showAudio={showAudio}
          showInventory={showInventory}
        />
      </div>
    </div>
  );
}
