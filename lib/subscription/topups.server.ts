import { log } from "next-axiom";
import prisma from "../db";

export const createTopUp = async (
  userId: string,
  amountPaidCents: number,
  creditIncrease: number,
  reference: string
) => {
  log.info(
    `Creating TopUp: ${userId} ${amountPaidCents} ${creditIncrease} ${reference}`
  );
  try {
    // const agent = await getAgent(userId);

    // if (!agent) {
    //   throw new Error("Agent not found");
    // }

    // const steamship = getSteamshipClient();

    // const result = await steamship.agent.post({
    //   url: agent.agentUrl,
    //   path: "/add_energy",
    //   arguments: {
    //     amount: creditIncrease,
    //     fail_if_exceed_max: false,
    //   },
    // });

    // if (!result.ok) {
    //   log.error(
    //     `Failed to add energy for ${userId} (${agentUrl}, ${amountPaidCents}, ${creditIncrease}, ${reference}). ${await result.text()}`
    //   );
    // }

    return await prisma.topUps.create({
      data: {
        ownerId: userId!,
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
