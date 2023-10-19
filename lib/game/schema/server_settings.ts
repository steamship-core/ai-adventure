export type ServerSettings = {
  default_profile_image_model?: string;
  default_background_image_model?: string;

  default_function_capable_llm_model?: string;
  default_function_capable_llm_temperature?: number;
  default_function_capable_llm_max_tokens?: number;

  default_llm_model?: string;
  default_llm_temperature?: string;
  default_llm_max_tokens?: string;

  default_narration_model?: string;

  default_background_music_model?: string;

  camp_image_prompt?: string;
  item_image_prompt?: string;
  profile_image_prompt?: string;
  quest_background_image_prompt?: string;

  /**
   * LORAs are stored as a record of:
   * - Civitai URL -> Trigger Word
   *
   * The trigger word will be auto-added to the prompt.
   *
   * If you want to wrap it in parenthesis and add a weight, that's ok.
   * E.g.: "(pixel art: 1.2)"
   */
  camp_image_loras?: Record<string, string>;
  item_image_loras?: Record<string, string>;
  profile_image_loras?: Record<string, string>;
  quest_background_image_loras?: Record<string, string>;

  music_prompt?: string;
};
