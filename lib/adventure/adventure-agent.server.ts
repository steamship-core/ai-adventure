import { Adventure } from "@prisma/client";
import { log } from "next-axiom";
import { ServerSettings } from "../game/schema/server_settings";
import { getSteamshipClient } from "../utils";

export const getServerSettingsFromAgent = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.agent.get({
    url: agentBase,
    path: "/serverSettings",
    arguments: {},
  });
  const body = await userSettings.json();
  return body as ServerSettings;
};

export const pushServerSettingsToAgent = async (
  agentBase: string,
  serverSettings: ServerSettings
) => {
  const steamship = getSteamshipClient();
  return await steamship.agent.post({
    url: agentBase,
    path: "/server_settings",
    arguments: serverSettings,
  });
};

export const pushAdventureToAgent = async (
  agentBase: string,
  adventure: Adventure
) => {
  console.log(`Pushing adventure ${adventure.id} to agent ${agentBase}`);
  log.info(`Pushing adventure ${adventure.id} to agent ${agentBase}`);
  const settings = adventure.agentConfig as any;
  return pushServerSettingsToAgent(agentBase, settings);
};

export const loadServerSettingsFromDisk = async () => {};
