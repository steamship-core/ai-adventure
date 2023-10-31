import { log } from "next-axiom";
import { v4 as uuidv4 } from "uuid";
import { pushAdventureToAgent } from "../adventure/adventure-agent.server";
import { getAdventure } from "../adventure/adventure.server";
import prisma from "../db";
import { getSteamshipClient } from "../utils";

export const getAgents = async (userId: string) => {
  return await prisma.agents.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      Adventure: {
        select: {
          name: true,
          description: true,
          createdAt: true,
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

export const createAgent = async (userId: string, adventureId: string) => {
  if (!process.env.STEAMSHIP_AGENT_VERSION) {
    log.error("No steamship agent version");
    throw Error("Please set the STEAMSHIP_AGENT_VERSION environment variable.");
  }

  var [_package, _version] = process.env.STEAMSHIP_AGENT_VERSION.split("@");

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
    log.info(`Switching to workspace: ${workspaceHandle}`);

    const packageInstance = await steamship.package.createInstance({
      package: _package,
      version: _version,
      handle: workspaceHandle,
    });

    log.info(`New agent package instance: ${packageInstance}`);

    const agentUrl = packageInstance.invocationURL;

    log.info(`New agent URL: ${agentUrl}`);

    const agent = await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: agentUrl,
        handle: workspaceHandle,
        adventureId: adventureId,
      },
    });

    const adventure = await getAdventure(adventureId);

    if (!adventure) {
      log.error(`Failed to get adventure: ${adventureId}`);
      throw new Error(`Failed to get adventure: ${adventureId}`);
    }

    // Now we need to await the agent's startup loop. This is critical
    // because if we perform an operation to quickly after initialization it will fail.
    await steamship.package.waitForInit(packageInstance);

    // Now we need to set the server settings.
    await pushAdventureToAgent(agent.agentUrl, adventure);

    return agent;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
