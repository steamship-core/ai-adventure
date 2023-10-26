import { log } from "next-axiom";
import prisma from "../db";

export const getSubscription = async (userId: string) => {
  return await prisma.subscriptions.findFirst({
    where: {
      ownerId: userId,
    },
  });
};

export const getSubscriptionFromStripeId = async (stripeId: string) => {
  return await prisma.subscriptions.findFirst({
    where: {
      stripeId: stripeId,
    },
  });
};

export const deleteSubscription = async (subscriptionId: string) => {
  log.info(`Deleting Subscription: ${subscriptionId}`);

  let res = await prisma.subscriptions.deleteMany({
    where: {
      subscriptionId: subscriptionId,
    },
  });
  return res.count;
};

export const createSubscription = async (
  userId: string,
  stripeId: string,
  subscriptionId: string
) => {
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
