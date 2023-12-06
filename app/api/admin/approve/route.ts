import {
  approveAdventure,
  getAdventure,
} from "@/lib/adventure/adventure.server";
import { sendAdventureApprovalEmail } from "@/lib/emails/adventure-approval";
import { withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const adventureId = searchParams.get("adventureId") || null;
  const approveKey = searchParams.get("approveKey") || null;

  if (!adventureId) {
    return new Response("Missing adventureId", {
      status: 401,
    });
  }

  if (!process.env.APPROVE_SECRET) {
    return new Response("Please set approveKey in env vars", {
      status: 401,
    });
  }

  if (approveKey != process.env.APPROVE_SECRET) {
    return new Response("Unauthorized. Check approveKey", {
      status: 401,
    });
  }

  const adventure = await approveAdventure(adventureId);
  const adv = await getAdventure(adventureId);
  await sendAdventureApprovalEmail(adv);
  return NextResponse.json(adventure, { status: 200 });
});
