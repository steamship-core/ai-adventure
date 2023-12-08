import prisma from "@/lib/db";
import type { NextRequest } from "next/server";

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

  // Gets all the tags from adventures and builds the Tags table.
  let tags: Record<string, number> = {};
  let adventures = await prisma.adventure.findMany({
    where: {
      deletedAt: null,
      public: true,
    },
  });
  for (const adventure of adventures) {
    for (const tag of adventure.tags) {
      if (tags[tag]) {
        tags[tag] += 1;
      } else {
        tags[tag] = 1;
      }
    }
  }

  for (const tag in tags) {
    await prisma.tags.upsert({
      where: {
        name: tag,
      },
      update: {
        count: tags[tag],
      },
      create: {
        name: tag,
        count: tags[tag],
      },
    });
  }

  return Response.json({ success: true });
}
