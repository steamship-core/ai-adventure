import { getAdventureForUser } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { log } from "next-axiom";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: { adventureId: string } }
): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    log.error("No filename");
    return NextResponse.json({ error: "filename not found" }, { status: 404 });
  }

  const adventure = await getAdventureForUser(userId, params.adventureId);
  if (!adventure) {
    log.error("No adventure");
    return NextResponse.json({ error: "Adventure not found" }, { status: 404 });
  }
  const blob = await put(
    `${adventure.id}-${uuidv4()}-${filename}`,
    request.body!,
    {
      access: "public",
    }
  );
  return NextResponse.json(blob);
}
