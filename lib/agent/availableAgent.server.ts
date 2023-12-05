import { Adventure, AvailableAgents } from "@prisma/client";
import { log } from "next-axiom";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
import { createAgentInSteamship } from "./agentSteamship.server";

export const deleteAvailableAgent = async (id: number) => {
  let res = await prisma.availableAgents.deleteMany({
    where: {
      id: id,
    },
  });
  return res.count;
};

// Creates the intent to create an available agent, but does not create the steamship
// side of things. This is intended to be a rapid write to the database!
export const createAvailableAgentIntent = async (
  adventure: Adventure,
  isDevelopment: boolean,
  onboardingDataJson: Record<string, any> | undefined = undefined
) => {
  const adventureId = adventure.id;

  console.log(`createAvailableAgentIntent -  AdventureId ${adventureId}`);
  log.info(`createAvailableAgentIntent -  AdventureId ${adventureId}`);

  try {
    const _onboardingDataJson = onboardingDataJson || {};

    // Stringify in a way that always prints the keys in the right order
    const onboardedData = JSON.stringify(
      _onboardingDataJson,
      Object.keys(_onboardingDataJson).sort()
    );

    const agentData = {
      adventureId: adventure.id,
      agentVersion: adventure.agentVersion,
      onboardedData,
      isDevelopment,
      state: "waiting",
    } as any;

    log.info(`New AvailableAgent Intent: ${JSON.stringify(agentData)}`);
    const agent = await prisma.availableAgents.create({ data: agentData });

    if (!agent) {
      log.error("AvailableAgent creation in Prisma failed.");
      console.log("AvailableAgent creation in Prisma failed.");
      return null;
    }

    return agent;
  } catch (e) {
    log.error(`${e}`);
    console.log(`Error: ${e}`);
    throw Error("Failed to create agent.");
  }
};

export const getAvailableAgent = async (
  adventureId: string,
  agentVersion: string,
  isDevelopment: boolean,
  onboardingDataJson: Record<string, any> | undefined = undefined,
  oldState: string,
  newState: string
): Promise<AvailableAgents | null> => {
  const _onboardingDataJson = onboardingDataJson || {};

  // Stringify in a way that always prints the keys in the right order
  const onboardedData = JSON.stringify(
    _onboardingDataJson,
    Object.keys(_onboardingDataJson).sort()
  );

  console.log("Trying to get agent", {
    adventureId,
    agentVersion,
    isDevelopment,
    onboardedData,
    oldState,
  });

  const agent = await prisma.availableAgents.findFirst({
    where: {
      adventureId,
      agentVersion,
      onboardedData,
      isDevelopment,
      state: oldState,
    },
    include: {
      Adventure: true,
    },
  });

  if (!agent) {
    return agent;
  }

  // Now we try to update it.
  const updated = await prisma.availableAgents.updateMany({
    data: {
      state: newState,
    },
    where: {
      id: agent.id,
      state: oldState, // This will fail to match if someone else updated it already.
    },
  });

  if (updated.count == 0) {
    console.log(
      `Someone else already reserved Agent ${agent.id} out from under us!`
    );
    return null;
  }

  agent.state = newState;
  return agent;
};

// Returns one for finishing the setup
export const getNextWaitingAvailableAgent =
  async (): Promise<AvailableAgents | null> => {
    const agent = await prisma.availableAgents.findFirst({
      where: {
        state: "waiting",
      },
    });

    if (!agent) {
      return agent;
    }

    // Now we try to update it.
    const updated = await prisma.availableAgents.updateMany({
      data: {
        state: "creating",
      },
      where: {
        id: agent.id,
        state: "waiting", // This will fail to match if someone else updated it already.
      },
    });

    if (updated.count == 0) {
      console.log(
        `A task else already reserved Agent ${agent.id} out from under us for processing!`
      );
      return null;
    }

    agent.state = "creating";
    return agent;
  };

// Completes an available intent to create an available agent. This is where we
// create the bits in steamship and then mark the agent as ready for usage.
export const completeAvailableAgentIntent = async (
  availableAgent: AvailableAgents
) => {
  console.log(
    `completeAvailableAgentIntent -  AvailableAgent ${availableAgent.id}`
  );
  log.info(`createAvailableAgent -  AvailableAgent ${availableAgent.id}`);
  const start = Date.now();

  if (availableAgent.adventureId == null) {
    throw new Error(`AvailableAgent ${availableAgent.id} has no adventureId.`);
  }

  if (availableAgent.state != "creating") {
    throw new Error(
      `AvailableAgent ${availableAgent.id} has state ${availableAgent.state}. Should be 'creating'.`
    );
  }

  try {
    const adventure = await getAdventure(availableAgent.adventureId!);
    const _agentData = await createAgentInSteamship(
      adventure,
      availableAgent.isDevelopment || false
    );

    const updated = await prisma.availableAgents.updateMany({
      data: {
        ..._agentData,
        state: "ready",
      },
      where: {
        id: availableAgent.id,
        state: "creating", // This will fail to match if someone else updated it already.
      },
    });

    if (updated.count == 0) {
      log.error("AvailableAgent completion in Prisma failed.");
      console.log("AvailableAgent completion in Prisma failed.");
      return null;
    }

    const end = Date.now();
    log.info(
      `🎲 Just completed AvailableAgent for a game of ${
        adventure.name
      } [CachedAgent: ${!!availableAgent}; CreateTimeMs: ${end - start}] `
    );

    return availableAgent;
  } catch (e) {
    log.error(`${e}`);
    console.log(`Error: ${e}`);
    throw Error("Failed to create agent.");
  }
};

export const findAndCompleteAvailableAgentRequest = async () => {
  const agent = await getNextWaitingAvailableAgent();
  if (!agent) {
    log.warn("No waiting AvailableAgent");
    return false;
  }

  log.info(`Completing AvailableAgent ${agent.id}`);
  await completeAvailableAgentIntent(agent);
  return false;
};
