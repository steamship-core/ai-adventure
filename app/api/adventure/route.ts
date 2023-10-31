import { createAdventure } from "@/lib/adventure/adventure.server";
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
