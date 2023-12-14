import { getUserIdFromClerkOrAnon } from "@/lib/anon-auth/anon-auth-server";
import { setEnergy } from "@/lib/energy/energy.server";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const userId = getUserIdFromClerkOrAnon(false);

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { operation } = (await request.json()) as {
    operation: "top-up-energy" | "deplete-energy";
  };

  try {
    if (operation == "top-up-energy") {
      log.info(`Topping up energy for ${userId}`);

      if (process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_TOPUP !== "true") {
        // Don't allow!
        return NextResponse.json(
          {
            error:
              "To enable free debug top-ups, please modify your environment variables.",
          },
          { status: 500 }
        );
      }

      await setEnergy(userId, 100);
      return NextResponse.json({ energy: 100 });
    } else if (operation == "deplete-energy") {
      log.info(`Depleting energy for ${userId}`);

      if (process.env.NEXT_PUBLIC_ALLOW_FREE_DEBUG_DEPLETE !== "true") {
        // Don't allow!
        return NextResponse.json(
          {
            error:
              "To enable debug depletes, please modify your environment variables.",
          },
          { status: 500 }
        );
      }

      console.log(`Depleting energy for ${userId}`);
      await setEnergy(userId, 0);
      return NextResponse.json({ energy: 0 });
    } else {
      return NextResponse.json(
        { error: `Unknown operation: ${operation}` },
        { status: 404 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to run debug." },
      { status: 404 }
    );
  }
}
