import { getSubscription } from "@/lib/subscription/subscription.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      log.error("No user");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = await getSubscription(userId);

    if (!subscription) {
      return NextResponse.json({ hasSubscription: false });
    }
    return NextResponse.json({ hasSubscription: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
