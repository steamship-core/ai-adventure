import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { log } from "next-axiom";
import { getAgent } from "../agent/agent.server";
import prisma from "../db";
import { getSteamshipClient } from "../utils";

export const createTopUp = async (
  userId: string,
  agentUrl: string,
  amountPaidCents: number,
  creditIncrease: number,
  reference: string
): Promise<
  Prisma.Prisma__SubscriptionsClient<
    {
      id: number;
      ownerId: string;
      agentUrl: string;
      amountPaidCents: number;
      creditIncrease: number;
      reference: string;
    },
    never,
    DefaultArgs
  >
> => {
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

    return await prisma.topUps.create({
      data: {
        ownerId: userId!,
        agentUrl: agentUrl!,
        amountPaidCents: amountPaidCents!,
        creditIncrease: creditIncrease!,
        reference: reference!,
      },
    });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create top-up.");
  }
};
