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

  const adventure = await createAdventure({
    creatorId: userId,
    createdBy: isAnonymous
      ? "Anonymous"
      : `${user?.firstName} ${user?.lastName}`,
    name,
    description,
    agentVersion,
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
  const cursor = searchParams.get("cursor") || null;
  const search = searchParams.get("search") || null;
  const sort = searchParams.get("sort") || "newest";

  const take = 25;

  const results = await prisma.adventure.findMany({
    take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: {
      ...(sort === "updated"
        ? { updatedAt: "desc" }
        : {
            // @ts-ignore
            createdAt: sortOptions[sort] || "desc",
          }),
    },
    where: {
      public: true,
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
    },
  });

  const lastPostInResults = results.length === take ? results[take - 1] : null;
  const nextCursor = lastPostInResults ? lastPostInResults.id : null;
  return NextResponse.json({
    nextCursor,
    prevCusor: cursor ? cursor : null,
    results,
  });
}
