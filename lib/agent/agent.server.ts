import { sql } from "@vercel/postgres";
import { log } from "next-axiom";
import { v4 as uuidv4 } from "uuid";
import { getSteamshipClient } from "../utils";

type Agent = {
  id: number;
  ownerId: string;
  agentUrl: string;
  handle: string;
  createdAt: Date;
  questName: string;
  questDescription: string;
};

export const getAgents = async (userId: string) => {
  const { rows } =
    await sql`SELECT * FROM "Agents" WHERE "ownerId" = ${userId};`;
  return rows as Agent[];
};

export const getAgent = async (userId: string) => {
  const { rows } =
    await sql`SELECT * FROM "Agents" WHERE "ownerId" = ${userId} LIMIT 1;`;
  return rows.length > 0 ? (rows as Agent[])[0] : null;
};

export const deleteAgent = async (userId: string) => {
  const { rows } = await sql`DELETE FROM "Agents" WHERE "ownerId" = ${userId};`;
  return rows.length;
};

export const createAgent = async (userId: string) => {
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

    // Create a new agent record in the database.
    const { rows } =
      await sql`INSERT INTO "Agents" ("ownerId", "agentUrl", "handle") VALUES (${userId}, ${agentUrl}, ${workspaceHandle}) RETURNING *;`;
    return rows.length > 0 ? (rows as Agent[])[0] : null;
  } catch (e) {
    log.error(`${e}`);
    console.error(e);
    throw Error("Failed to create agent.");
  }
};
