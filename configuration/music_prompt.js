/**
 * Music Generation Prompt
 * =======================
 *
 * The prompt below will be used to generate the game's background music.
 *
 * When it is run, it will have access to the following variables:
 *
 * - genre:        The genre of the game, set by the user during onboarding
 * - tone:         The tone of the game, set by the user during onboarding
 * - description:  The current scene in which the music is to be played
 *
 * To use these variables, enclose them in curly brackets, like this:
 *
 *     16-bit game score. Has a {tone} feel to it. Scene description: {description}
 *
 * You do not need to use all/any of the variables in your prompt.
 *
 * Have fun!
 */

module.exports = {
  name: "music_prompt",
  newlines_to_spaces: true,
  value: `
16-bit game score for a quest game scene.
{genre} genre.
{tone}.
Scene description: {description}
`,
};
