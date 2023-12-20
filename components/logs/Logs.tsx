"use client";

import { ReactNode } from "react";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyH4 } from "../ui/typography/TypographyH4";

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
  workspaceId = "",
  gameEngineVersion = "",
  adventureId,
  elasticLink,
  logRows,
}: {
  agentBaseUrl: string;
  gameEngineVersion?: string;
  workspaceHandle?: string;
  workspaceId?: string;
  adventureId?: string;
  elasticLink?: string;
  logRows?: any[];
}) {
  const eLink = elasticLink?.replace("{workspaceId}", workspaceId);

  return (
    <LogsContainer>
      <div className="mt-4">
        <TypographyH2>Agent Information</TypographyH2>
        <TypographyH4>Workspace</TypographyH4>
        <a
          className="underline"
          href={`https://www.steamship.com/dashboard/agents/workspaces/${workspaceHandle}`}
        >
          {workspaceHandle}
        </a>
        <div>
          Note: Make sure you are logged in as the right Steamship user.
        </div>
        <TypographyH4>Agent Version</TypographyH4>
        <div>{gameEngineVersion}</div>
        <TypographyH4>Agent Base URL</TypographyH4>
        <div>{agentBaseUrl}</div>
        <TypographyH4>Elastic Link</TypographyH4>
        <a className="underline" href={eLink}>
          Link
        </a>
      </div>
    </LogsContainer>
  );
}
