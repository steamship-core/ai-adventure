import { sql } from "@vercel/postgres";
import { log } from "next-axiom";
import { getAgent } from "../agent/agent.server";
import { getSteamshipClient } from "../utils";

type TopUps = {
  id: number;
  ownerId: string;
  agentUrl: string;
  amountPaidCents: number;
  creditIncrease: number;
  reference: string;
};

export const createTopUp = async (
  userId: string,
  agentUrl: string,
  amountPaidCents: number,
  creditIncrease: number,
  reference: string
) => {
  log.info(
    `Creating TopUp: ${userId} ${agentUrl} ${amountPaidCents} ${creditIncrease} ${reference}`
  );
  try {
    const agent = await getAgent(userId);

    if (!agent) {
      throw new Error("Agent not found");
    }

    const steamship = getSteamshipClient();

    const result = await steamship.agent.post({
      url: agent.agentUrl,
      path: "/add_energy",
      arguments: {
        amount: creditIncrease,
        fail_if_exceed_max: false,
      },
    });

    if (!result.ok) {
      log.error(
        `Failed to add energy for ${userId} (${agentUrl}, ${amountPaidCents}, ${creditIncrease}, ${reference}). ${await result.text()}`
      );
    }
    const { rows } =
      await sql`INSERT INTO "TopUps" ("ownerId", "agentUrl", "amountPaidCents", "creditIncrease", "reference") VALUES (${userId}, ${agentUrl}, ${amountPaidCents}, ${creditIncrease}, ${reference}) RETURNING *;`;
    return rows.length > 0 ? (rows as TopUps[])[0] : null;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create top-up.");
  }
};
