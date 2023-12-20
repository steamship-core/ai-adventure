import { Adventure, AvailableAgents } from "@prisma/client";
import stringify from "json-stable-stringify";
import { log } from "next-axiom";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
import {
  gameStateSupportsCompletingOnboarding,
  saveGameState,
} from "../game/game-state.server";
import { completeOnboarding } from "../game/onboarding";
import { GameState } from "../game/schema/game_state";
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
  gameState: Partial<GameState> | undefined = undefined
) => {
  const adventureId = adventure.id;

  console.log(`createAvailableAgentIntent -  AdventureId ${adventureId}`);
  log.info(`createAvailableAgentIntent -  AdventureId ${adventureId}`);

  try {
    const _gameState = gameState || {};

    const fixedGameState = stringify(_gameState);

    const agentData = {
      adventureId: adventure.id,
      adventureVersion: adventure.version,
      agentVersion: adventure.agentVersion,
      gameState: fixedGameState,
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
  adventureVersion: number,
  agentVersion: string,
  isDevelopment: boolean,
  gameState: Partial<GameState> | undefined = undefined,
  oldState: string,
  newState: string
): Promise<AvailableAgents | null> => {
  const _gameState = gameState || {};

  // Stringify in a way that always prints the keys in the right order
  const fixedGameState = stringify(_gameState);

  console.log("Trying to get agent", {
    adventureId,
    adventureVersion,
    agentVersion,
    isDevelopment,
    fixedGameState,
    oldState,
  });

  const agent = await prisma.availableAgents.findFirst({
    where: {
      adventureId,
      adventureVersion,
      agentVersion,
      gameState: fixedGameState,
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

    let completeOnboardingCalled = false;

    if (availableAgent.gameState) {
      log.info(
        `🎲 AvailableAgent has a GameState so will complete onboarding - ${adventure.name}`
      );

      const start2 = Date.now();

      const gameState = JSON.parse(availableAgent.gameState);

      log.info(`Saving gameState`);
      await saveGameState(_agentData.agentUrl, gameState as GameState);

      if (gameStateSupportsCompletingOnboarding(gameState as GameState)) {
        await completeOnboarding(_agentData.agentUrl);
      }

      const end2 = Date.now();
      log.info(
        `🎲 Onboarding AvailableAgent for a game of ${
          adventure.name
        } [CachedAgent: ${!!availableAgent}; OnboardingTimeMs: ${
          end2 - start2
        }] `
      );
      completeOnboardingCalled = true;
    }

    const updated = await prisma.availableAgents.updateMany({
      data: {
        ..._agentData,
        state: "ready",
        completeOnboardingCalled,
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
      `🎲 Just created AvailableAgent for a game of ${
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
