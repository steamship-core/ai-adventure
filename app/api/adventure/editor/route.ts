import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { op, data } = await request.json();

    if (op === "update") {
      const adventureId = "";
      await updateAdventure(data, adventureId);
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${op}.` },
        { status: 404 }
      );
    }
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    return NextResponse.json(
      { error: "Failed to adventure." },
      { status: 404 }
    );
  }
}
