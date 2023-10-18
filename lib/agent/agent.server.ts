import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { log } from "next-axiom";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db";
import {
  saveServerSettingsFromConfiguration,
  saveServerSettingsFromDiskConfiguration,
} from "../game/server_settings.server";
import { getSteamshipClient } from "../utils";

export const getAgent = async (
  userId: string
): Promise<Prisma.Prisma__AgentsClient<
  {
    id: number;
    ownerId: string;
    agentUrl: string;
  },
  never,
  DefaultArgs
> | null> => {
  return await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });
};

export const deleteAgent = async (userId: string): Promise<number> => {
  let res = await prisma.agents.deleteMany({
    where: {
      ownerId: userId!,
    },
  });
  return res.count;
};

export const createAgent = async (
  userId: string
): Promise<
  Prisma.Prisma__AgentsClient<
    {
      id: number;
      ownerId: string;
      agentUrl: string;
    },
    never,
    DefaultArgs
  >
> => {
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
      },
    });

    // Now we need to await the agent's startup loop. This is critical
    // because if we perform an operation to quickly after initialization it will fail.
    await saveServerSettingsFromDiskConfiguration(agent.agentUrl);

    // Now we need to set the server settings.
    await saveServerSettingsFromConfiguration(agent.agentUrl);

    return agent;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
