import { log } from "next-axiom";
import { NextResponse } from "next/server";
import prisma from "../db";
import { clerkIdToSteamshipHandle, getSteamshipClient } from "../utils";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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
  console.log(`Getting agent for user ${userId}`);
  return await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });
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
    // Switch into the web user's workspace.
    const workspaceHandle = clerkIdToSteamshipHandle(userId);

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

    return await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: agentUrl,
      },
    });
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
