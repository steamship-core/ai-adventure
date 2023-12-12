// Updates agent version

import { Adventure } from "@prisma/client";
import { updateAdventure } from "../adventure/adventure.server";
import prisma from "../db";

const TO_VERSION = "ai-adventure@2.2.10";

function shouldUpgrade(adventure: Adventure) {
  if (adventure.agentVersion == TO_VERSION) {
    console.log(`[SKIP; Current] ${adventure.name}`);
    return false;
  }
  if (adventure.name == "🏰👸➡️🛡️🚶‍♂️💪🔑") {
    console.log(`[SKIP; Special Case] ${adventure.name}`);
    return false;
  }
  if (adventure.name == "Mr. Meatball's Saucy Escape") {
    return true;
  }
  return false;
}

const upgradeAdventuresToNewAgentVersion = async () => {
  // console.log("These are all the game instances");
  var adventures = await prisma.adventure.findMany({});
  console.log(`Got ${adventures?.length} Adventures`);

  for (const adventure of adventures) {
    if (shouldUpgrade(adventure)) {
      let newAdventure = await updateAdventure(
        adventure.creatorId,
        adventure.id,
        { game_engine_version: TO_VERSION }
      );
      console.log(
        `Updated ${adventure.name} from ${adventure.agentVersion} to ${newAdventure.agentVersion}`
      );
    }
  }
};

upgradeAdventuresToNewAgentVersion();
