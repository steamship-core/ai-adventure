import { getAdventureForUser } from "@/lib/adventure/adventure.server";
import { SettingGroups } from "@/lib/editor/editor-options";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const adventure = await getAdventureForUser(userId, params.handle);
  if (!adventure) {
    log.error("No adventure");
    return NextResponse.json({ error: "Adventure not found" }, { status: 404 });
  }

  log.info(
    `Getting schema for adventure ${adventure.id} which uses Steamship package ${adventure.agentVersion}`
  );

  // NOTE: We currently just use the hard coded one.
  const schema = {
    settingGroups: SettingGroups,
  };

  return NextResponse.json(schema);
}
