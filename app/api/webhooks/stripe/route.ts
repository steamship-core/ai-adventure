import {
  createSubscription,
  deleteSubscription,
  getSubscriptionFromStripeId,
} from "@/lib/subscription/subscription.server";
import { createTopUp } from "@/lib/subscription/topups.server";
import Cors from "micro-cors";
import { log } from "next-axiom";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const TOP_UP_ENERGY = 100;

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.log(body);
    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature, secret);
    log.info(`Stripe Event ${event.type}:${event.id}`);

    const userId = event.data?.object?.metadata?.userId;
    const subscriptionId = event.data?.object?.subscription;
    const stripeId = event.data?.object?.customer;
    const status = event.data?.object?.status;
    const paymentStatus = event.data?.object?.payment_status;
    const objectId = event.data?.object?.id;
    const amountPaidCents = event.data?.object?.amount_total;
    const currency = event.data?.object?.currency;
    const cancelAt = event.data?.object?.cancel_at;
    const canceledAt = event.data?.object?.canceled_at;

    // Note: Stripe Metadata turns everything into a string.
    const topUp = event.data?.object?.metadata?.topUp === "true";

    if (event.type === "checkout.session.completed") {
      if (status !== "complete") {
        const msg = `Status was not complete. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (amountPaidCents <= 0) {
        const msg = `amountPaid was less than 1 cent USD. ${JSON.stringify(
          event
        )}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (currency !== "usd") {
        const msg = `Currency was not USD. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (paymentStatus !== "paid") {
        const msg = `paymentStatus was not paid. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (!userId) {
        const msg = `Missing userId in Stripe Metadata. ${JSON.stringify(
          event
        )}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (topUp) {
        /* Add the payment; for Top-Up we do this on the Checkout Complete event. */
        // const agent = await getAgent(userId);

        // if (!agent) {
        //   throw new Error(`Agent not found, ${userId}`);
        // }

        await createTopUp(
          userId,
          amountPaidCents,
          TOP_UP_ENERGY,
          JSON.stringify({
            stripeId,
            topUp,
            subscriptionId,
            objectId,
            paymentStatus,
            currency,
          })
        );
      } else {
        /* It was a subscription creation */
        if (!topUp && !subscriptionId) {
          const msg = `Missing subscriptionId in Stripe Metadata. topUp=${topUp}. ${JSON.stringify(
            event
          )}`;
          log.error(msg);
          console.log(msg);
          throw Error(msg);
        }

        if (!topUp && !stripeId) {
          const msg = `Missing stripeId in Stripe Metadata. topUp=${topUp} ${JSON.stringify(
            event
          )}`;
          log.error(msg);
          console.log(msg);
          throw Error(msg);
        }

        log.info(`Creating subscription for ${userId}, stripeId=${stripeId}`);
        await createSubscription(userId, stripeId, subscriptionId);

        /* Add the payment; for Top-Up we do this on the Checkout Complete event. */
        // const agent = await getAgent(userId);

        // if (!agent) {
        //   throw new Error(`Agent not found, ${userId}`);
        // }

        log.info(
          `Topping up new subscription for ${userId}, stripeId=${stripeId}`
        );
        await createTopUp(
          userId,
          amountPaidCents,
          TOP_UP_ENERGY,
          JSON.stringify({
            stripeId,
            topUp,
            subscriptionId,
            objectId,
            paymentStatus,
            currency,
          })
        );
      }
    } else if (event.type === "customer.subscription.updated") {
      if (canceledAt) {
        // They canceled it.
        if (!stripeId) {
          const msg = `Stripe customer ID was null. ${JSON.stringify(event)}`;
          log.error(msg);
          console.log(msg);
          throw Error(msg);
        }

        // Now we have to loop up the user.
        const subscription = await getSubscriptionFromStripeId(stripeId);

        if (!subscription) {
          const msg = `Unable to find subscription for customer ${stripeId}. This could be because it's a new subscription. ${JSON.stringify(
            event
          )}`;
          log.warn(msg);
          console.log(msg);
          return NextResponse.json({ result: event, ok: true });
        }

        if (!subscription.subscriptionId) {
          const msg = `Unable to find subscription.subscriptionId for customer ${stripeId}. This could be because it's a new subscription. ${JSON.stringify(
            event
          )}`;
          log.warn(msg);
          console.log(msg);
          return NextResponse.json({ result: event, ok: true });
        }
        log.error(
          `Canceling ${userId} subscription ${subscription.subscriptionId}.`
        );
        deleteSubscription(subscription.subscriptionId);
      } else {
        log.error(`User ${userId} un-canceled.`);
        if (stripeId && subscriptionId && status == "active") {
          // The user might have just re-actived their subscription. Since we don't refund
          // a prorated amount, this means we just need to check and re-add the subscription object
          // if it has been deleted.

          // Now we have to loop up the user.
          const subscription = await getSubscriptionFromStripeId(stripeId);

          if (!subscription) {
            log.info(`Re-activating ${userId} subscription ${subscriptionId}.`);
            await createSubscription(userId, stripeId, subscriptionId);
          }
        }
      }
    } else if (event.type === "invoice.paid") {
      if (status !== "paid") {
        const msg = `Status was not paid. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (amountPaidCents <= 0) {
        const msg = `amountPaid was less than 1 cent USD. ${JSON.stringify(
          event
        )}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (currency !== "usd") {
        const msg = `Currency was not USD. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      if (!stripeId) {
        const msg = `Stripe customer ID was null. ${JSON.stringify(event)}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      // Now we have to loop up the user.
      const subscription = getSubscriptionFromStripeId(stripeId);

      if (!subscription) {
        const msg = `Unable to find subscription for customer ${stripeId}. This could be because it's a new subscription. ${JSON.stringify(
          event
        )}`;
        log.warn(msg);
        console.log(msg);
        return NextResponse.json({ result: event, ok: true });
      }

      if (!userId) {
        const msg = `Missing userId in Stripe Metadata. ${JSON.stringify(
          event
        )}`;
        log.error(msg);
        console.log(msg);
        throw Error(msg);
      }

      // const agent = await getAgent(userId);

      // if (!agent) {
      //   throw new Error(`Agent not found, ${userId}`);
      // }

      log.info(
        `Topping up existing subscription for ${userId}, stripeId=${stripeId}`
      );
      await createTopUp(
        userId,
        amountPaidCents,
        TOP_UP_ENERGY,
        JSON.stringify({
          stripeId,
          topUp,
          subscriptionId,
          objectId,
          paymentStatus,
          currency,
        })
      );
    }
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    log.error(`${error}`);
    console.error(error);
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
}
