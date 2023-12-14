import { createAdventure } from "@/lib/adventure/adventure.server";
import { sortOptions } from "@/lib/adventure/constants";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, user } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { isAnonymous, name, description, agentVersion } = await request.json();

  const _agentVersion =
    (agentVersion as string) || process.env.STEAMSHIP_AGENT_VERSION;

  const adventure = await createAdventure({
    creatorId: userId,
    createdBy: isAnonymous
      ? "Anonymous"
      : `${user?.firstName} ${user?.lastName}`,
    name,
    description,
    agentVersion: _agentVersion!,
  });

  if (!adventure) {
    log.error("No adventure");
    return NextResponse.json(
      { error: "Adventure not created" },
      { status: 500 }
    );
  }
  return NextResponse.json({ adventure }, { status: 201 });
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const page = parseInt(searchParams.get("pageParam") || "0");
  const search = searchParams.get("search") || null;
  const tag = searchParams.get("tag") || null;
  const sort = searchParams.get("sort") || "reactions";

  const pageSize = 25;

  let freeTextClause = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    }),
  };

  let whereExtension: any = tag
    ? {
        AND: [
          {
            tags: {
              has: tag,
            },
          },
          { ...freeTextClause },
        ],
      }
    : {
        ...freeTextClause,
      };
  const results = await prisma.adventure.findMany({
    take: pageSize,
    skip: page * pageSize,
    orderBy: {
      ...(sort === "updated"
        ? { updatedAt: "desc" }
        : sort === "reactions"
        ? { Reactions: { _count: "desc" } }
        : // @ts-ignore
          { createdAt: sortOptions[sort] }),
    },
    where: {
      public: true,
      deletedAt: null, // Only those that are not deleted
      ...whereExtension,
    },
    include: {
      Reactions: true,
    },
  });

  // Prisma stinks - Need to loop over everything :( (or use raw SQL)
  results.forEach((adventure) => {
    // @ts-ignore
    adventure.mappedReactions = adventure.Reactions.reduce(
      (acc, reaction) => ({
        ...acc,
        [reaction.emojiId]: (acc[reaction.emojiId] || 0) + 1,
      }),
      {} as Record<string, number>
    );
  });

  return NextResponse.json({
    nextPage: page + 1,
    prevPage: page > 0 ? page - 1 : null,
    results,
  });
}
