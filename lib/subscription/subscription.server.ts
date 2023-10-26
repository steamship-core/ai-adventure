import { sql } from "@vercel/postgres";
import { log } from "next-axiom";

type Subscriptions = {
  id: number;
  ownerId: string;
  stripeId: string;
  priceId: string;
  subscriptionId: string;
};

export const getSubscription = async (userId: string) => {
  const { rows } =
    await sql`SELECT * FROM "Subscriptions" WHERE "ownerId" = ${userId} LIMIT 1;`;
  return rows.length > 0 ? (rows as Subscriptions[])[0] : null;
};

export const getSubscriptionFromStripeId = async (stripeId: string) => {
  const { rows } =
    await sql`SELECT * FROM "Subscriptions" WHERE "stripeId" = ${stripeId} LIMIT 1;`;
  return rows.length > 0 ? (rows as Subscriptions[])[0] : null;
};

export const deleteSubscription = async (subscriptionId: string) => {
  log.info(`Deleting Subscription: ${subscriptionId}`);
  const { rows } =
    await sql`DELETE FROM "Subscriptions" WHERE "subscriptionId" = ${subscriptionId};`;
  return rows.length;
};

export const createSubscription = async (
  userId: string,
  stripeId: string,
  subscriptionId: string
) => {
  log.info(`Creating TopUp: ${userId} ${stripeId} ${subscriptionId}`);

  try {
    const { rows } =
      await sql`INSERT INTO "Subscriptions" ("ownerId", "stripeId", "subscriptionId") VALUES (${userId}, ${stripeId}, ${subscriptionId}) RETURNING *;`;
    return rows.length > 0 ? (rows as Subscriptions[])[0] : null;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create subscription.");
  }
};
