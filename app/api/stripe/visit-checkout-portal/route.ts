import { ensureStripeEnvVars } from "@/lib/subscription/stripe.server";
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
    const { userId, user } = auth();

    const searchParams = new URL(req.url).searchParams;
    const topUp = searchParams.get("topUp") === "true";

    if (!userId) {
      log.error("No user");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    ensureStripeEnvVars();

    const unitAmount = parseInt(
      process.env.NEXT_PUBLIC_STRIPE_UNIT_AMOUNT || ""
    );

    if (unitAmount <= 0) {
      throw new Error(
        "STRIPE_UNIT_AMOUNT env var did not parse to a positive integer"
      );
    }

    var emailAddress = undefined;
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      emailAddress = `${user.emailAddresses[0]}`;
    }

    const params = topUp
      ? // Top Up
        {
          customer_email: emailAddress,
          billing_address_collection: "auto",
          payment_method_types: ["card"],
          mode: "payment",
          currency: process.env.NEXT_PUBLIC_STRIPE_CURRENCY,
          line_items: [
            {
              price: process.env.STRIPE_TOPUP_PRICE_ID,
              quantity: 1,
            },
          ],
          metadata: {
            userId: userId,
            topUp: true,
          },
          success_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/account/plan?topUp=true&success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/account/plan?canceled=true`,
        }
      : // Subscription
        {
          customer_email: emailAddress,
          billing_address_collection: "auto",
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID!,
              quantity: 1,
            },
          ],
          metadata: {
            userId: userId,
            topUp: false,
          },
          success_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/account/plan?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/account/plan?canceled=true`,
        };

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params as any);

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
