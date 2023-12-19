export const dynamic = "force-dynamic";

import Logs from "@/components/logs/Logs";
import { getAgent } from "@/lib/agent/agent.server";
import { getLogs } from "@/lib/agent/agentSteamship.server";
import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function QuestPage({
  params,
}: {
  params: { handle: string; questId: string };
}) {
  const userId = getUserIdFromClerkOrAnon();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId, params.handle);
  if (!agent) {
    redirect("/adventures");
  }

  const workspaceHandle = agent.handle;

  const logs = await getLogs(workspaceHandle);

  console.log(logs);

  return (
    <Logs
      workspaceHandle={agent.handle}
      gameEngineVersion={agent.agentVersion || "Unknown"}
      agentBaseUrl={agent.agentUrl}
      adventureId={agent.adventureId!}
    />
  );
}
