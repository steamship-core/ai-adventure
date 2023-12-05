import { findAndCompleteAvailableAgentRequest } from "@/lib/agent/availableAgent.server";
import type { NextRequest } from "next/server";

// Run for five minutes
export const maxDuration = 300;
const appCodeCutoffSeconds = 60 * 4; // 4 minutes

/**
 * Transitions as many AvailableAgents with state=waiting to state=ready as possible in appCodeCutoffSeconds seconds.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const start = Date.now();
  let end = Date.now();
  let elapsedSeconds = (end - start) / 1000;

  // Keep finishing tasks for 10 minutes as long as we're being successful at it
  let curated = 0;
  while (elapsedSeconds < appCodeCutoffSeconds) {
    let didIt = await findAndCompleteAvailableAgentRequest();
    if (didIt) {
      curated += 1;
    }
    if (!didIt) {
      return Response.json({ success: true, curated, elapsedSeconds });
    }
    end = Date.now();
    elapsedSeconds = (end - start) / 1000.0;
  }

  return Response.json({ success: true, curated, elapsedSeconds });
}
