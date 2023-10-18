import { getSteamshipClient } from "../utils";
import { ServerSettings } from "./schema/server_settings";
import DefaultServerSettings from "./server_settings_loader.server";

export const getServerSettings = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const userSettings = await steamship.agent.get({
    url: agentBase,
    path: "/serverSettings",
    arguments: {},
  });
  const body = await userSettings.json();
  return body as ServerSettings;
};

export const saveServerSettings = async (
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

export const saveServerSettingsFromConfiguration = async (
  agentBase: string
) => {
  return saveServerSettings(agentBase, DefaultServerSettings);
};

export const loadServerSettingsFromDisk = async () => {};
