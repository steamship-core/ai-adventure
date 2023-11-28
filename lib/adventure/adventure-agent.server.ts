import { Adventure } from "@prisma/client";
import { log } from "next-axiom";
import { ServerSettings } from "../game/schema/server_settings";
import { getSteamshipClient } from "../utils";

export const getServerSettingsFromAgent = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.agent.get({
    url: agentBase,
    path: "/server_settings",
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
  adventure: Adventure,
  isDevelopment: boolean = false
) => {
  console.log(
    `Pushing adventure ${adventure.id} to agent ${agentBase}. isDevelopment=${isDevelopment}`
  );
  log.info(
    `Pushing adventure ${adventure.id} to agent ${agentBase}. isDevelopment=${isDevelopment}`
  );
  const settings = (
    isDevelopment ? adventure.agentDevConfig : adventure.agentConfig
  ) as any;
  return pushServerSettingsToAgent(agentBase, settings);
};

export const loadServerSettingsFromDisk = async () => {};

export const requestMagicCreation = async (
  agentBase: string,
  serverSettings: ServerSettings
) => {
  const steamship = getSteamshipClient();
  return await steamship.agent.post({
    url: agentBase,
    path: "/generate_configuration",
    arguments: serverSettings,
  });
};
