import { notifyOnInternalMilestones } from "@/lib/notifications/internal-milestone";
import type { NextRequest } from "next/server";

// Run for five minutes
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  await notifyOnInternalMilestones();
  return Response.json({ success: true });
}
