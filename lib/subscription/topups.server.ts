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
