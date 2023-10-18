/**
 * Quest Background Image Prompt
 * =============================
 *
 * The prompt below will be used to generate the background image for a quest.
 *
 * When it is run, it will have access to the following variables:
 *
 * - description:  The description of the quest.
 *
 * To use these variables, enclose them in curly brackets, like this:
 *
 *     16-bit (pixel art) {description}
 *
 * You do not need to use all/any of the variables in your prompt.
 *
 * Have fun!
 *
 */

module.exports = {
  name: "quest_background_image_prompt",
  newlines_to_spaces: true,
  value: `
(pixel art) background scene for a quest.
The scene being depicted is: {description}  
`,
};
