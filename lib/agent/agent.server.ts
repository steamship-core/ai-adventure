import { Agents, AvailableAgents } from "@prisma/client";
import { log } from "next-axiom";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
import { saveGameState } from "../game/game-state.server";
import { completeOnboarding } from "../game/onboarding";
import { GameState } from "../game/schema/game_state";
import { sendSlackMessage } from "../slack/slack.server";
import { createAgentInSteamship } from "./agentSteamship.server";
import {
  createAvailableAgentIntent,
  getAvailableAgent,
} from "./availableAgent.server";

export const getAgents = async (userId: string) => {
  return await prisma.agents.findMany({
    where: {
      ownerId: userId,
      isDevelopment: false,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      Adventure: {
        select: {
          name: true,
          description: true,
          createdAt: true,
          image: true,
          tags: true,
        },
      },
    },
  });
};

export const getAgent = async (userId: string, handle: string) => {
  return await prisma.agents.findFirst({
    where: {
      ownerId: userId,
      handle,
    },
    include: {
      Adventure: true,
    },
  });
};

export const deleteAgent = async (userId: string) => {
  let res = await prisma.agents.deleteMany({
    where: {
      ownerId: userId,
    },
  });
  return res.count;
};

export const createAgent = async (
  userId: string,
  adventureId: string,
  isDevelopment: boolean = false,
  useAvailableAgentCache = true,
  gameState: Partial<GameState> | undefined = undefined
) => {
  console.log(
    `createAgent - UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}; gameState ${gameState}`
  );
  log.info(
    `createAgent - UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}; gameState ${gameState}`
  );
  const start = Date.now();

  try {
    const adventure = await getAdventure(adventureId);

    let availableAgent: AvailableAgents | null = null;

    if (useAvailableAgentCache) {
      availableAgent = await getAvailableAgent(
        adventureId,
        adventure.version,
        adventure.agentVersion,
        isDevelopment,
        gameState,
        "ready",
        "claimed"
      );
    }

    let agent: Agents | undefined = undefined;
    let agentData: any | undefined = undefined;
    let cachedAgent = false;

    if (availableAgent) {
      // We need to swap this over to the agent table!
      if (availableAgent.state != "claimed") {
        throw new Error(
          `AvailableAgent ${availableAgent.id} has state ${availableAgent.state}. Should be 'claimed'.`
        );
      }

      agentData = {
        agentUrl: availableAgent.agentUrl,
        handle: availableAgent.handle,
        agentVersion: availableAgent.agentVersion,
        adventureId: availableAgent.adventureId,
        workspaceId: availableAgent.workspaceId,
        workspaceHandle: availableAgent.workspaceHandle,
        ownerId: userId!,
        isDevelopment: isDevelopment,
        completeOnboardingCalled: availableAgent.completeOnboardingCalled,
        adventureVersion: availableAgent.adventureVersion,
      };
      log.info(
        `Deleting AvailableAgent and turning to Agent. AvailableAgentId=${
          availableAgent.id
        } JSON: ${JSON.stringify(agentData)}`
      );

      await prisma.availableAgents.delete({
        where: {
          id: availableAgent.id,
        },
      });

      cachedAgent = true;
    } else {
      // We need to create a new agent from scratch!
      const _agentData = await createAgentInSteamship(adventure, isDevelopment);
      agentData = {
        ..._agentData,
        ownerId: userId!,
        isDevelopment: isDevelopment,
        adventureVersion: adventure.version,
      } as any;
      log.info(
        `Creating entirely new agent; no cached one existed: ${JSON.stringify(
          agentData
        )}`
      );
    }

    if (!agentData) {
      log.error("Agent creation in Prisma failed: no agentData.");
      console.log("Agent creation in Prisma failed: no agentData.");
      return null;
    }

    agent = await prisma.agents.create({ data: agentData });

    if (!agent) {
      log.error("Agent creation in Prisma failed.");
      console.log("Agent creation in Prisma failed.");
      return null;
    }

    if (!cachedAgent && gameState) {
      // Save the game state
      console.log(`Saving gamestate ${gameState}`);
      await saveGameState(agent.agentUrl, gameState as GameState);

      // Completing onboarding
      console.log(`Completing onboarding`);
      await completeOnboarding(agent.agentUrl);
    }

    // Now we need to enqueue a few clones of this agent!
    await createAvailableAgentIntent(adventure, isDevelopment, gameState);

    // Do it again!
    await createAvailableAgentIntent(adventure, isDevelopment, gameState);

    if (!isDevelopment) {
      const end = Date.now();
      const msg = `🎲 User ${userId} just started a game of ${
        adventure.name
      } [CachedAgent: ${!!availableAgent}; CreateTimeMs: ${end - start}] `;
      console.log(msg);
      await sendSlackMessage(msg);
    }

    return agent;
  } catch (e) {
    log.error(`${e}`);
    console.log(`Error: ${e}`);
    throw Error("Failed to create agent.");
  }
};
