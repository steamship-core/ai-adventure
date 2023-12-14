import prisma from "@/lib/db";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { log } from "next-axiom";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Webhook } from "svix";

export async function POST(request: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  if (evt.object != "event") {
    // See: https://clerk.com/docs/users/sync-data
    const _msg = `The 'object' field should always be 'event'. Was: ${requestJson.object}`;
    log.error(_msg);
    console.error(_msg);
    return NextResponse.json({ error: _msg }, { status: 500 });
  }

  switch (evt.type) {
    case "user.created":
      const emails = evt.data.email_addresses;
      let email: string | null = null;
      let emailVerified: boolean | null = null;

      if (emails.length > 0) {
        email = emails[0].email_address;
        emailVerified = emails[0].verification?.status == "verified";
      }

      const data = {
        userId: evt.data.id,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        email: email,
        emailVerified: emailVerified,
        username: evt.data.username,
        profileImageUrl: evt.data.profile_image_url || evt.data.image_url,
        privateMetadata: { ...(evt.data.private_metadata as any) },
        publicMetadata: { ...(evt.data.public_metadata as any) },
        unsafeMetadata: { ...(evt.data.unsafe_metadata as any) },
      };

      await prisma.userInfo.create({ data });

      break;
    default:
      // Unhandled
      break;
  }

  return Response.json({ success: true });
}
