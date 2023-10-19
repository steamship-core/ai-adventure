import { ensureStripeEnvVars } from "@/lib/subscription/stripe.server";
import { getSubscription } from "@/lib/subscription/subscription.server";
import { auth } from "@clerk/nextjs";
import Cors from "cors";
import { log } from "next-axiom";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const cors = Cors({
  methods: ["POST", "GET", "OPTIONS"],
});

export async function POST(req: Request) {
  try {
    ensureStripeEnvVars();

    const { userId, user } = auth();

    if (!userId) {
      log.error("No user");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    var emailAddress = undefined;
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      emailAddress = `${user.emailAddresses[0]}`;
    }

    const subscription = await getSubscription(userId);

    if (!subscription) {
      log.error("No subscription");
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const stripeId = subscription.stripeId;

    if (!stripeId) {
      log.error("No stripeId");
      return NextResponse.json(
        { error: "Subscription stripeID not found" },
        { status: 404 }
      );
    }

    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer: stripeId,
      return_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/account/plan`,
    };

    const session: Stripe.BillingPortal.Session =
      await stripe.billingPortal.sessions.create(params);

    return NextResponse.redirect(session.url!, {
      status: 303,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "POST, GET, OPTIONS",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}
