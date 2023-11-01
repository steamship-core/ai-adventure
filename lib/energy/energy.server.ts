import prisma from "../db";

export const getOrCreateUserEnergy = async (userId: string) => {
  const energy = await prisma.userEnergy.findFirst({
    where: {
      userId: userId,
    },
  });
  if (energy) {
    return energy;
  }
  const newEnergy = await prisma.userEnergy.create({
    data: {
      userId: userId,
    },
  });
  return newEnergy;
};

export const setEnergy = async (userId: string, amount: number) => {
  const energy = await getOrCreateUserEnergy(userId);
  energy.energy = amount;
  return await prisma.userEnergy.update({
    where: {
      id: energy.id,
    },
    data: {
      energy: energy.energy,
    },
  });
};

export const addEnergy = async (userId: string, amount: number) => {
  const energy = await getOrCreateUserEnergy(userId);
  energy.energy += amount;
  return await prisma.userEnergy.update({
    where: {
      id: energy.id,
    },
    data: {
      energy: energy.energy,
    },
  });
};

export const consumeEnergy = async (
  userId: string,
  amount: number,
  reference: string = ""
) => {
  const energy = await getOrCreateUserEnergy(userId);
  energy.energy -= amount;

  // Record the drawdown for good measure.
  await prisma.drawDowns.create({
    data: {
      ownerId: userId,
      creditDecrease: amount,
      reference: reference,
    },
  });

  return await prisma.userEnergy.update({
    where: {
      id: energy.id,
    },
    data: {
      energy: energy.energy,
    },
  });
};
