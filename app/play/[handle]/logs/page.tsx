export const dynamic = "force-dynamic";

import Logs from "@/components/logs/Logs";
import { getAgent } from "@/lib/agent/agent.server";
import { getWorkspaceId } from "@/lib/agent/agentSteamship.server";
import { isUserAdmin } from "@/lib/user/is-admin";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function QuestPage({
  params,
}: {
  params: { handle: string; questId: string };
}) {
  const isAdmin = await isUserAdmin();
  const { userId } = auth();

  if (!isAdmin) {
    log.error("Not an admin");
    throw new Error("Not an admin");
  }

  if (!userId) {
    log.error("No user id");
    throw new Error("No user id");
  }

  const agent = await getAgent(userId, params.handle);
  if (!agent) {
    redirect("/adventures");
  }

  const workspaceHandle = agent.handle;
  const workspaceId = await getWorkspaceId(workspaceHandle);

  return (
    <Logs
      workspaceHandle={agent.handle}
      gameEngineVersion={agent.agentVersion || "Unknown"}
      agentBaseUrl={agent.agentUrl}
      elasticLink={process.env.ELASTIC_LINK}
      workspaceId={workspaceId}
      adventureId={agent.adventureId!}
    />
  );
}
