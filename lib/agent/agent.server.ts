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

export const createAgent = async (
  userId: string,
  adventureId: string,
  isDevelopment: boolean = false
) => {
  console.log(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}`
  );
  log.info(
    `createAgent -  UserId ${userId}; AdventureId ${adventureId}; isDevelopment ${isDevelopment}`
  );

  const adventure = await getAdventure(adventureId);

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

    const agentData = {
      ownerId: userId!,
      agentUrl: agentUrl,
      handle: workspaceHandle,
      adventureId: adventureId,
      isDevelopment: isDevelopment,
      agentVersion: adventure.agentVersion,
      workspaceHandle: workspaceHandle,
      workspaceId: packageInstance.workspaceId,
    };

    log.info(`New agent: ${JSON.stringify(agentData)}`);
    const agent = await prisma.agents.create({ data: agentData });

    if (!agent) {
      log.error("Agent creation in Prisma failed.");
      console.log("Agent creation in Prisma failed.");
      return null;
    }
    // Now we need to await the agent's startup loop. This is critical
    // because if we perform an operation to quickly after initialization it will fail.
    await steamship.package.waitForInit(packageInstance);

    // Now we need to set the server settings.
    await pushAdventureToAgent(agent.agentUrl, adventure, isDevelopment);

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
