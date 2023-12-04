import { findAndCompleteAvailableAgentRequest } from "@/lib/agent/availableAgent.server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }

  const start = Date.now();
  let end = Date.now();
  let elapsedMinutes = (end - start) / (1000 * 60);

  // Keep finishing tasks for 10 minutes as long as we're being successful at it
  let curated = 0;
  while (elapsedMinutes < 10) {
    let didIt = await findAndCompleteAvailableAgentRequest();
    if (didIt) {
      curated += 1;
    }
    if (!didIt) {
      return Response.json({ success: true, curated, elapsedMinutes });
    }
    end = Date.now();
    elapsedMinutes = (end - start) / (1000.0 * 60);
  }

  return Response.json({ success: true, curated, elapsedMinutes });
}
