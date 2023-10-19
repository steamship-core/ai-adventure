import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { log } from "next-axiom";
import prisma from "../db";

export const getSubscription = async (
  userId: string
): Promise<Prisma.Prisma__SubscriptionsClient<
  {
    id: number;
    ownerId: string;
    stripeId: string;
    priceId: string;
    subscriptionId: string;
  },
  never,
  DefaultArgs
> | null> => {
  return await prisma.subscriptions.findFirst({
    where: {
      ownerId: userId!,
    },
  });
};

export const getSubscriptionFromStripeId = async (
  stripeId: string
): Promise<Prisma.Prisma__SubscriptionsClient<
  {
    id: number;
    ownerId: string;
    stripeId: string;
    priceId: string;
    subscriptionId: string;
  },
  never,
  DefaultArgs
> | null> => {
  return await prisma.subscriptions.findFirst({
    where: {
      stripeId: stripeId!,
    },
  });
};

export const deleteSubscription = async (
  subscriptionId: string
): Promise<number> => {
  log.info(`Deleting Subscription: ${subscriptionId}`);

  let res = await prisma.subscriptions.deleteMany({
    where: {
      subscriptionId: subscriptionId!,
    },
  });
  return res.count;
};

export const createSubscription = async (
  userId: string,
  stripeId: string,
  subscriptionId: string
): Promise<
  Prisma.Prisma__SubscriptionsClient<
    {
      id: number;
      ownerId: string;
      stripeId: string;
      priceId: string;
      subscriptionId: string;
    },
    never,
    DefaultArgs
  >
> => {
  log.info(`Creating TopUp: ${userId} ${stripeId} ${subscriptionId}`);

  try {
    return await prisma.subscriptions.create({
      data: {
        ownerId: userId!,
        stripeId: stripeId!,
        priceId: process.env.STRIPE_PRICE_ID || "",
        subscriptionId: subscriptionId!,
      },
    });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create subscription.");
  }
};
