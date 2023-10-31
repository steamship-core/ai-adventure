import {
  publishAdventure,
  updateAdventure,
} from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { log, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (request: Request) => {
  const { userId } = auth();
  if (!userId) {
    log.error("No user");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { operation, id, data } = await request.json();

    if (operation === "update") {
      await updateAdventure(userId, id, data);
      return NextResponse.json(data, { status: 200 });
    } else if (operation == "publish") {
      await publishAdventure(userId, id, data);
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${operation}.` },
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
});
