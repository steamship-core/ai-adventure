export type ServerSettings = {
  default_profile_image_model?: string;
  default_background_image_model?: string;

  default_function_capable_llm_model?: string;
  default_function_capable_llm_temperature?: string;
  default_function_capable_llm_max_tokens?: string;

  default_llm_model?: string;
  default_llm_temperature?: string;
  default_llm_max_tokens?: string;

  default_narration_model?: string;

  default_background_music_model?: string;

  camp_image_prompt?: string;
  item_image_prompt?: string;
  profile_image_prompt?: string;
  quest_background_image_prompt?: string;

  camp_image_loras?: string[];
  item_image_loras?: string[];
  profile_image_loras?: string[];
  quest_background_image_loras?: string[];

  music_prompt?: string;
};
