import { Prompt } from "./prompt";
import { StableDiffusionTheme } from "./stable_diffusion_theme";

/**
 * TODO: Available items?
 */

export type ServerSettings = {
  // ADVENTURE SETTINGS
  // ****************************************************************************************************

  /**
   * The number of quests to generate for a single adventure.
   */
  quests_per_adventure?: number;

  /**
   * Difficulty modifier.
   *
   * This modifier is a number that is multiplied AGAINST every "dice roll" the user makes.
   * That means a value of:
   *
   * - 0.5 will halve the likelihood of player success
   * - 2.0 will double the likelihood of player success
   * - 0.0 will make every roll a failure
   */
  difficulty_modifier?: number;

  /**
   * The universe that the adventure takes place in. Write as if it follows an executive
   * summary heading underneath the "WORLD DESCRIPTION" heading, such as:
   *
   *    A space station orbiting a black hole in the Andromeda galaxy. Not in contact with other stations
   *    for years. The station is running out of food and oxygen. The station is in danger of being pulled
   *    into the black hole and only has a few days left.
   */
  adventure_universe_description?: Prompt;

  // QUEST SETTINGS
  // ****************************************************************************************************

  obstacles_per_quest?: number;

  // LOCATION SETTINGS
  // Customize game.
  // ****************************************************************************************************

  /**
   * The number of challenges to encounter in a single quest.
   */

  // STORY GENERATION
  // ****************************************************************************************************

  default_story_model?: string;
  default_story_temperature?: number;
  default_story_max_tokens?: number;

  // IMAGE GENERATION
  // ****************************************************************************************************

  /**
   * A list of Stable Diffusion Image themes.
   * Including your own custom theme will let you apply it to image prompts.
   */
  image_themes?: StableDiffusionTheme[];

  /**
   * The Stable Diffusion theme for generating camp images.
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   * Or reference one of the ones included in this file.
   */
  camp_image_theme?: string;
  camp_image_prompt?: string;
  camp_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating item images.
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   * Or reference one of the ones included in this file.
   */
  item_image_theme?: string;
  item_image_prompt?: string;
  item_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating profile images.
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   * Or reference one of the ones included in this file.
   */
  profile_image_theme?: string;
  profile_image_prompt?: string;
  profile_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating quest background images.
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   * Or reference one of the ones included in this file.
   */
  quest_background_theme?: string;
  quest_background_image_prompt?: string;
  quest_background_image_negative_prompt?: string;

  // STORY NARRATION
  //
  // One of the pre-made voice narration themes available by the story engine.
  //
  // Unlike the Stable Diffusion themes, these can only be selected --- but not created --- by the web
  // client.
  // ****************************************************************************************************

  narration_theme?: string;

  // MUSIC GENERATION
  // ****************************************************************************************************

  default_background_music_model?: string;
  music_prompt?: string;

  // AGENT DECISION MAKING
  // Note: You probably DO NOT need to alter these settings.
  // ****************************************************************************************************
  default_function_capable_llm_model?: "gpt-3.5-turbo" | "gpt-4";
  default_function_capable_llm_temperature?: number;
  default_function_capable_llm_max_tokens?: number;

  generation_task_id?: string;
};
