"use client";

import { ReactNode } from "react";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH2 } from "../ui/typography/TypographyH2";

const LogsContainer = ({ children }: { children: ReactNode }) => (
  <div className="max-w-2xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4">
    <div className={`flex flex-col w-full`}>
      <div className="flex flex-row items-center overflow-hidden justify-start gap-4">
        <TypographyH1>Logs</TypographyH1>
      </div>
    </div>
    {children}
  </div>
);

export default function Logs({
  agentBaseUrl,
  workspaceHandle = "",
  gameEngineVersion = "",
  adventureId,
  logRows,
}: {
  agentBaseUrl: string;
  gameEngineVersion?: string;
  workspaceHandle?: string;
  adventureId?: string;
  logRows?: any[];
}) {
  return (
    <LogsContainer>
      <div className="mt-4">
        <TypographyH2>Agent Information</TypographyH2>
        <ul>
          <li>Workspace: {workspaceHandle}</li>
          <li>Agent Version: {gameEngineVersion}</li>
          <li>Base URL: {agentBaseUrl}</li>
        </ul>
      </div>
      <div className="mt-4">
        <TypographyH2>Workspace Logs</TypographyH2>
        <ul>
          {(logRows || []).map((logRow) => (
            <li></li>
          ))}
        </ul>
      </div>
    </LogsContainer>
  );
}
