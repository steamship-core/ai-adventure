/**
 * Camp Image Prompt
 * =================
 *
 * The prompt below will be used to generate the game's camp image.
 *
 * When it is run, it will have access to the following variables:
 *
 * - genre:        The genre of the game, set by the user during onboarding
 * - tone:         The tone of the game, set by the user during onboarding
 *
 * To use these variables, enclose them in curly brackets, like this:
 *
 *     (pixel art), {tone}, {genre} camp.
 *
 * You do not need to use all/any of the variables in your prompt.
 *
 * Have fun!
 *
 */

module.exports = {
  name: "camp_image_prompt",
  newlines_to_spaces: true,
  value: `
  (pixel art) {tone} {genre} camp.
`,
};
