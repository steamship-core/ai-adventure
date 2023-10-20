import { StableDiffusionTheme } from "./stable_diffusion_theme";

export type ServerSettings = {
  // STORY GENERATION
  // ****************************************************************************************************

  default_llm_model?: string;
  default_llm_temperature?: string;
  default_llm_max_tokens?: string;

  // IMAGE GENERATION
  // ****************************************************************************************************

  /**
   * A list of Stable Diffusion Image themes.
   *
   * Including your own custom theme will let you apply it to image prompts.
   *
   */
  image_themes?: StableDiffusionTheme[];

  /**
   * The Stable Diffusion theme for generating camp images.
   *
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   *
   * Or reference one of the ones included in this file.
   */
  camp_image_theme?: string;
  camp_image_prompt?: string;
  camp_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating item images.
   *
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   *
   * Or reference one of the ones included in this file.
   */
  item_image_theme?: string;
  item_image_prompt?: string;
  item_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating profile images.
   *
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   *
   * Or reference one of the ones included in this file.
   */
  profile_image_theme?: string;
  profile_image_prompt?: string;
  profile_image_negative_prompt?: string;

  /**
   * The Stable Diffusion theme for generating quest background images.
   *
   * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
   *
   * Or reference one of the ones included in this file.
   */
  quest_background_theme?: string;
  quest_background_image_prompt?: string;
  quest_background_image_negative_prompt?: string;

  // STORY NARRATION
  // ****************************************************************************************************

  default_narration_model?: string;

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
};
