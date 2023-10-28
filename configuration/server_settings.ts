// import { Prompt } from "@/lib/game/schema/prompt";
// import { ServerSettings } from "@/lib/game/schema/server_settings";
// import CampImagePrompt from "./image_prompts/camp_image_prompt";

// function prompt_to_string(prompt: Prompt): string {
//   let value = prompt.value;
//   if (prompt.newlines_to_spaces === true) {
//     value = value.replaceAll("\n", " ");
//   }
//   value = value.trim();
//   return value;
// }

// /**
//  * These settings are pushed into the game engine upon new game creation.
//  *
//  * See lib/game/schema/server_settings.ts for documentation.
//  */
// const server_settings: ServerSettings = {
//   // STORY GENERATION
//   // ****************************************************************************************************

//   default_story_model: "gpt-4",
//   default_story_temperature: 0.4,
//   default_story_max_tokens: 256,

//   // IMAGE GENERATION
//   // ****************************************************************************************************

//   /**
//    * A list of Stable Diffusion Image themes.
//    *
//    * Including your own custom theme will let you apply it to image prompts.
//    *
//    */
//   image_themes: [

// z  ],

//   /**
//    * The Stable Diffusion theme for generating camp images.
//    *
//    * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
//    *
//    * Or reference one of the ones included in this file.
//    */
//   camp_image_theme: 'pixel_art_1',
//   camp_image_prompt: '{tone} {genre} camp.',
//   camp_image_negative_prompt: '',

//   /**
//    * The Stable Diffusion theme for generating item images.
//    *
//    * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
//    *
//    * Or reference one of the ones included in this file.
//    */
//   item_image_theme?: 'pixel_art_1',
//   item_image_prompt?: `16-bit retro-game sprite for an item in a hero's inventory.
//   The items's name is: {name}.
//   The item's description is: {description}.`

//   /**
//    * The Stable Diffusion theme for generating profile images.
//    *
//    * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
//    *
//    * Or reference one of the ones included in this file.
//    */
//   profile_image_theme?: string;
//   profile_image_prompt?: string;
//   profile_image_negative_prompt?: string;

//   /**
//    * The Stable Diffusion theme for generating quest background images.
//    *
//    * Use a built-in theme: "pixel_art_1" | "pixel_art_2"
//    *
//    * Or reference one of the ones included in this file.
//    */
//   quest_background_theme?: string;
//   quest_background_image_prompt?: string;
//   quest_background_image_negative_prompt?: string;

//   // STORY NARRATION
//   // ****************************************************************************************************

//   /**
//    * Narration Model
//    *
//    * Valid models are:
//    *   - elevenlabs
//    */
//   default_narration_model: "elevenlabs",

//   /**
//    * Quest Energy Cost
//    *
//    * This is how much energy each quest depletes from a user.
//    */
//   quest_cost: 10,

//   /**
//    * Profile Image
//    */
//   camp_image_prompt: prompt_to_string(CampImagePrompt),
// };

// module.exports = server_settings;
