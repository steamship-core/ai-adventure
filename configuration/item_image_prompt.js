/**
 * Item Image Prompt
 * =================
 *
 * The prompt below will be used to generate the game's item images.
 *
 * When it is run, it will have access to the following variables:
 *
 * - name:         The name of the item.
 * - description:  The description of the item.
 *
 * To use these variables, enclose them in curly brackets, like this:
 *
 *     16-bit retro-game sprite for a {name} in a hero's inventory.
 *
 * You do not need to use all/any of the variables in your prompt.
 *
 * Have fun!
 *
 * Set the below variable to true to replace prompt newlines with spaces.
 * collapse_newlines=true
 */

module.exports = {
  name: "item_image_prompt",
  newlines_to_spaces: true,
  value: `
(pixel art) 16-bit retro-game sprite for an item in a hero's inventory.
The items's name is: {name}.
The item's description is: {description}.  
`,
};
