import { Agents, AvailableAgents } from "@prisma/client";
import { log } from "next-axiom";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
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
  onboardingDataJson: Record<string, any> | undefined = undefined
) => {
  console.log(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}`
  );
  log.info(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}`
  );
  const start = Date.now();

  try {
    const adventure = await getAdventure(adventureId);

    let availableAgent: AvailableAgents | null = null;

    if (useAvailableAgentCache) {
      availableAgent = await getAvailableAgent(
        adventureId,
        adventure.agentVersion,
        isDevelopment,
        onboardingDataJson,
        "ready",
        "claimed"
      );
    }

    let agent: Agents | undefined = undefined;
    let agentData: any | undefined = undefined;

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
    } else {
      // We need to create a new agent from scratch!
      const _agentData = await createAgentInSteamship(adventure, isDevelopment);
      agentData = {
        ..._agentData,
        ownerId: userId!,
        isDevelopment: isDevelopment,
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

    // Now we need to enqueue a few clones of this agent!
    await createAvailableAgentIntent(
      adventure,
      isDevelopment,
      onboardingDataJson
    );

    // Do it again!
    await createAvailableAgentIntent(
      adventure,
      isDevelopment,
      onboardingDataJson
    );

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
