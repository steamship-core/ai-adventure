import { log } from "next-axiom";
import prisma from "../db";
import { addEnergy } from "../energy/energy.server";

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
    const topUp = await prisma.topUps.create({
      data: {
        ownerId: userId!,
        amountPaidCents: amountPaidCents!,
        creditIncrease: creditIncrease!,
        reference: reference!,
      },
    });

    // Now add the energy to the userEnergy table
    await addEnergy(userId, creditIncrease);

    return topUp;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create top-up.");
  }
};
