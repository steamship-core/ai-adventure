/*
 * This is a hacky loader for assembling a ServerSettings object from the
 * files located in configuration/
 *
 * TODO: Is there a way to validate that the `name` values comply with the type?
 *       Ideally in a way that would still leave the configuration/ folder in a state
 *       that could be easily edited.
 */
import { ServerSettings } from "./schema/server_settings";

import * as _camp_image_prompt from "@/configuration/image_prompts/camp_image_prompt";
import * as _item_image_prompt from "@/configuration/item_image_prompt";
import * as _music_prompt from "@/configuration/music_prompt";
import * as _profile_image_prompt from "@/configuration/profile_image_prompt";
import * as _quest_background_image_prompt from "@/configuration/quest_background_image_prompt";
import * as _server_settings_base from "@/configuration/server_settings";

interface IPrompt {
  name: string;
  newlines_to_spaces?: boolean;
  value: string;
}

function register(base_settings: any, prompts: IPrompt[]): ServerSettings {
  for (let prompt of prompts) {
    let value = prompt.value;
    if (prompt.newlines_to_spaces === true) {
      value = value.replaceAll("\n", " ");
    }
    value = value.trim();
    base_settings[prompt.name] = value;
  }

  return base_settings as ServerSettings;
}

const server_settings = register(_server_settings_base, [
  _quest_background_image_prompt,
  _profile_image_prompt,
  _music_prompt,
  _item_image_prompt,
  _camp_image_prompt,
]);

export default server_settings;
