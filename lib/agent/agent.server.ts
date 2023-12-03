import { Adventure, Agents, AvailableAgents } from "@prisma/client";
import { log } from "next-axiom";
import { v4 as uuidv4 } from "uuid";
import { pushAdventureToAgent } from "../adventure/adventure-agent.server";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
import { sendSlackMessage } from "../slack/slack.server";
import { getSteamshipClient } from "../utils";

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

export const deleteAvailableAgent = async (id: number) => {
  let res = await prisma.availableAgents.deleteMany({
    where: {
      id: id,
    },
  });
  return res.count;
};

export const createAgentInSteamship = async (
  adventure: Adventure,
  isDevelopment: boolean
) => {
  const adventureId = adventure.id;

  console.log(`createAgentInSteamship -  AdventureId ${adventure.id}`);
  log.info(`createAgentInSteamship -  AdventureId ${adventure.id}`);

  if (!adventure) {
    log.error(`Failed to get adventure: ${adventureId}`);
    console.log(`Failed to get adventure: ${adventureId}`);
    throw new Error(`Failed to get adventure: ${adventureId}`);
  }

  let steamshipAgentAndVersion: string | undefined = adventure.agentVersion;
  log.info(
    `Adventure ${adventureId} uses Steamship Agent ${steamshipAgentAndVersion}`
  );
  if (!steamshipAgentAndVersion) {
    steamshipAgentAndVersion = process.env.STEAMSHIP_AGENT_VERSION;
    log.info(
      `Adventure ${adventureId} doesn't specify a Steamship Agent. Using ENV-provided: ${steamshipAgentAndVersion}`
    );
  }

  if (!steamshipAgentAndVersion) {
    log.error(
      "No Steamship agent version. Please set the STEAMSHIP_AGENT_VERSION environment variable."
    );
    console.log(
      "No Steamship agent version. Please set the STEAMSHIP_AGENT_VERSION environment variable."
    );
    throw Error(
      "No Steamship agent version. Please set the STEAMSHIP_AGENT_VERSION environment variable."
    );
  }

  var [_package, _version] = steamshipAgentAndVersion.split("@");

  log.info(
    `Creating instance of Steamship Package ${_package} at version ${_version}`
  );

  try {
    // Create a unique workspace handle for this user.
    const workspaceHandle = `${uuidv4()}`.toLowerCase();

    // Create a new agent instance.
    const steamship = await getSteamshipClient().switchWorkspace({
      workspace: workspaceHandle,
    });

    log.info(`Switching to workspace: ${workspaceHandle}`);

    const packageInstance = await steamship.package.createInstance({
      package: _package,
      version: _version,
      handle: workspaceHandle,
    });

    log.info(
      `New agent package instance: ${packageInstance} in workspace ${packageInstance.workspaceId}`
    );

    const agentUrl = packageInstance.invocationURL;

    // Now we need to await the agent's startup loop. This is critical
    // because if we perform an operation to quickly after initialization it will fail.
    await steamship.package.waitForInit(packageInstance);

    // Now we need to set the server settings.
    await pushAdventureToAgent(agentUrl, adventure, isDevelopment);

    const agentData = {
      agentUrl: agentUrl,
      handle: workspaceHandle,
      adventureId: adventureId,
      agentVersion: adventure.agentVersion,
      workspaceHandle: workspaceHandle,
      workspaceId: packageInstance.workspaceId,
    };

    return agentData;
  } catch (e) {
    log.error(`${e}`);
    console.log(`Error: ${e}`);
    throw Error("Failed to create agent.");
  }
};

export const getSchema = async (agentBase: string) => {
  console.log(`getSchema -  AgentBase ${agentBase}`);
  log.info(`getSchema -  AgentBase ${agentBase}`);

  const steamship = getSteamshipClient();
  try {
    const schemaResponse = await steamship.agent.get({
      url: agentBase,
      path: "/server_settings_schema",
      arguments: {},
    });
    if (!schemaResponse.ok) {
      const errorStr = `Failed to get schema: ${
        schemaResponse.status
      }. ${await schemaResponse.text()}}`;
      throw new Error(errorStr);
    }

    // TODO: The server returns a list of SettingGroup objects.
    const schemaResponseJson = await schemaResponse.json();
    return { settingGroups: schemaResponseJson };
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};

// Creates an agent that is available and waiting for hot-swap use
export const createAvailableAgent = async (
  adventure: Adventure,
  isDevelopment: boolean,
  onboardingDataJson: Record<string, any> | undefined = undefined
) => {
  const adventureId = adventure.id;

  console.log(`createAvailableAgent -  AdventureId ${adventureId}`);
  log.info(`createAvailableAgent -  AdventureId ${adventureId}`);

  try {
    const _agentData = await createAgentInSteamship(adventure, isDevelopment);

    const _onboardingDataJson = onboardingDataJson || {};

    // Stringify in a way that always prints the keys in the right order
    const onboardedData = JSON.stringify(
      _onboardingDataJson,
      Object.keys(_onboardingDataJson).sort()
    );

    const agentData = {
      ..._agentData,
      onboardedData,
      isDevelopment,
    } as any;

    log.info(`New AvailableAgent: ${JSON.stringify(agentData)}`);
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
  onboardingDataJson: Record<string, any> | undefined = undefined
): Promise<AvailableAgents | null> => {
  const _onboardingDataJson = onboardingDataJson || {};

  // Stringify in a way that always prints the keys in the right order
  const onboardedData = JSON.stringify(
    _onboardingDataJson,
    Object.keys(_onboardingDataJson).sort()
  );

  return await prisma.availableAgents.findFirst({
    where: {
      adventureId,
      agentVersion,
      onboardedData,
      isDevelopment,
    },
    include: {
      Adventure: true,
    },
  });
};

export const createAgent = async (
  userId: string,
  adventureId: string,
  isDevelopment: boolean = false,
  useAvailableAgentCache = false,
  onboardingDataJson: Record<string, any> | undefined = undefined
) => {
  console.log(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}`
  );
  log.info(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}; useAvailableAgentCache ${useAvailableAgentCache}`
  );

  try {
    const adventure = await getAdventure(adventureId);

    let availableAgent: AvailableAgents | null = null;

    if (useAvailableAgentCache) {
      availableAgent = await getAvailableAgent(
        adventureId,
        adventure.agentVersion,
        isDevelopment,
        onboardingDataJson
      );
    }

    let agent: Agents | undefined = undefined;
    let agentData: any | undefined = undefined;

    if (availableAgent) {
      // We need to swap this over to the agent table!
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

    await sendSlackMessage(
      `🎲 User ${userId} just started a new game: ${adventure.name}!`
    );

    return agent;
  } catch (e) {
    log.error(`${e}`);
    console.log(`Error: ${e}`);
    throw Error("Failed to create agent.");
  }
};
