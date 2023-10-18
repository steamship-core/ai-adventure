/**
 * These settings are pushed into the game engine upon new game creation.
 */
module.exports = {
  /**
   * Game Engine Decision Model
   *
   * Used for in-game decision making.
   *
   * Valid values are:
   *   - gpt-3.5-turbo
   *   - gpt-4
   */
  default_function_capable_llm_model: "gpt-3.5-turbo",
  default_function_capable_llm_temperature: 0.4,
  default_function_capable_llm_max_tokens: 512,

  /**
   * Storytelling Model
   *
   * Used to generate story text.
   *
   * Valid models are:
   *   - gpt-3.5-turbo
   *   - gpt-4
   */
  default_story_model: "gpt-4",
  default_story_temperature: 0.4,
  default_story_max_tokens: 256,

  /**
   * Narration Model
   *
   * Used to generate audio narration.
   *
   * Valid models are:
   *   - elevenlabs
   */
  default_narration_model: "elevenlabs",

  /**
   * Quest Energy Cost
   *
   * This is how much energy each quest depletes from a user.
   */
  quest_cost: 10,
};
