import {
  deleteAdventure,
  importAdventure,
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
    let { operation, id, data } = await request.json();

    if (operation === "update") {
      const adventure = await updateAdventure(userId, id, data);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation === "delete") {
      const adventure = await deleteAdventure(userId, id);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation == "import") {
      data = {
        ...{
          // Defaults
          adventure_name: "Untitled Adventure",
          adventure_description: "Empty Description",
          adventure_short_description: "Empty Short Description",
        },
        ...data,
      };
      const adventure = await importAdventure(userId, id, data);
      return NextResponse.json(adventure, { status: 200 });
    } else if (operation == "publish") {
      const adventure = await publishAdventure(userId, id);
      return NextResponse.json(adventure, { status: 200 });
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${operation}.` },
        { status: 500 }
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
