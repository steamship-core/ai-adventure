import { log } from "next-axiom";

export const getAdventure = async (adventureId: string) => {
  console.log("TODO: getAdventure", adventureId);
  // return await prisma.adventures.findFirst({
  //   where: {
  //     ownerId: adventureId,
  //   },
  // });
  return {};
};

export const updateAdventure = async (updateObj: any, adventureId: string) => {
  const adventure = getAdventure(adventureId);
  if (!adventure) {
    throw Error(`Failed to get adventure: ${adventureId}`);
  }

  try {
    console.log("updateAdventure", updateObj, adventureId);
    console.log("TODO: Update field of adventure object.");
    console.log("TODO: Save adventure object.");
    return {};
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
