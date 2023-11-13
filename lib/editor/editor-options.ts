export type OptionValue = {
  value: string;
  label: string;
  audioSample?: string;
  imageSample?: string;
  description?: string;
};

const DEFAULT_THEMES = [
  {
    value: "pixel_art_1",
    label: "Pixel Art 1",
    imageSample: "/image_samples/pixel_art_1.png",
  },
  {
    value: "pixel_art_2",
    label: "Pixel Art 2",
    imageSample: "/image_samples/pixel_art_2.png",
  },
  {
    value: "pixel_art_3",
    label: "Pixel Art 3",
    imageSample: "/image_samples/pixel_art_3.png",
  },
  {
    value: "epic_realism",
    label: "Epic Realism",
    imageSample: "/image_samples/epic_realism.jpeg",
  },
  {
    value: "ff7r",
    label: "FF7R",
    imageSample: "/image_samples/ff7r.jpeg",
  },
  {
    value: "cinematic_animation",
    label: "Cinematic Animation",
    imageSample: "/image_samples/cinematic_animation.jpeg",
  },
];

export type Setting = {
  name: string;
  label: string;
  description: string;
  type:
    | "select"
    | "text"
    | "textarea"
    | "longtext"
    | "options"
    | "boolean"
    | "list"
    | "tag-list"
    | "image"
    | "int"
    | "float"
    | "divider";
  listof?: "object" | "text";
  default?: string | number | boolean;
  options?: OptionValue[];
  includeDynamicOptions?: "image-themes";
  required?: boolean;
  unused?: boolean;
  listSchema?: Setting[];
  requiresApproval?: boolean;
  requiredText?: string;
};

export type SettingGroup = {
  spacer?: boolean;
  title: string;
  description?: string;
  href?: string;
  settings?: Setting[];
};

/**
 * The keys here are what would be found in the agentConfig.
 * The values are the top-level keys that are on an Adventure object.
 */
export const TopLevelSpecialCases = {
  adventure_name: "name",
  adventure_description: "description",
  adventure_short_description: "shortDescription",
  adventure_image: "image",
  adventure_tags: "tags",
  adventure_public: "public",
};

/**
 * Return any top-level update to the Adventure object from an agentConfig object.
 * @param agentConfig
 * @returns
 */
export function getTopLevelUpdatesFromAdventureConfig(agentConfig: any) {
  let topLevelUpdates: Record<string, any> = {};
  for (const [agentConfigName, topLevelName] of Object.entries(
    TopLevelSpecialCases
  )) {
    topLevelUpdates[topLevelName as string] = agentConfig[agentConfigName];
  }

  if (
    agentConfig["game_engine_version"] &&
    agentConfig["game_engine_version"].startsWith("ai-adventure@")
  ) {
    topLevelUpdates["agentVersion"] = agentConfig["game_engine_version"];
  }

  return topLevelUpdates;
}

export const GeneralOptions: Setting[] = [
  {
    name: "adventure_public",
    label: "Public",
    description:
      "NOTE: Only approved users can set an adventure to public. Ask in https://steamship.com/discord.",
    type: "boolean",
    requiresApproval: true,
    requiredText:
      "To make your adventure public and visible to the community, your account must be approved.",
  },
  {
    name: "adventure_name",
    label: "Adventure Name",
    description: "What name will others see this adventure by?",
    type: "text",
    default: "",
    required: true,
  },
  {
    name: "adventure_short_description",
    label: "Short Description",
    description:
      "A catchy one-liner to help your adventure stand out in the discover page",
    type: "text",
    default: "",
    required: true,
  },
  {
    name: "adventure_description",
    label: "Description",
    description: "A longer description of this adventure. Go into detail!",
    type: "textarea",
    default: "",
    required: true,
  },
  {
    name: "adventure_tags",
    label: "Tags",
    description: "A list of short string tags.",
    type: "tag-list",
    listof: "text",
  },
  {
    name: "adventure_image",
    label: "Image",
    description: "Select an image to represent this adventure.",
    type: "image",
    default: "",
    required: true,
  },
  {
    name: "adventure_player_singular_noun",
    label: "Noun for a 'Player'",
    description:
      "The singular noun used to refer to the pre-made player options. E.g.: Choose your Player (Adventurer, Hero, etc.)",
    type: "text",
    default: "Player",
  },
];

export const storyOptionsToDisplay = [
  "narrative_tone",
  "narrative_voice",
  "adventure_background",
  "adventure_goal",
];

export const StoryOptions: Setting[] = [
  {
    name: "story_general_divider",
    label: "Storytelling Guidance",
    description: "These settings will guide how the LLM generates your story.",
    type: "divider",
  },
  {
    // Validated
    name: "narrative_tone",
    label: "Narrative Tone",
    description:
      "What is the narrative tone of the storytelling? E.g.: Serious, Silly, Gritty, Heady, etc.",
    type: "text",
    default: "silly",
  },
  {
    // Validated
    name: "narrative_voice",
    label: "Narrative Voice",
    description:
      "What is the narrative voice of the storytelling? E.g.: children’s book, young adult novel, fanfic, high literature.",
    type: "text",
    default: "young adult novel",
  },
  {
    // Validated
    name: "adventure_background",
    label: "Adventure Background",
    description: `Description of the background setting in which the adventure will take place.  

Can include descriptions of genre, characters, specific items and locations that exist in the world, references to real-world things, etc.`,
    type: "longtext",
    default: "A fantasy world .",
  },
  {
    // Validated
    name: "adventure_goal",
    label: "Adventure Goal",
    description: `What is the ultimate goal / motivation of this adventure?`,
    type: "longtext",
    default: "To rid the world of evil",
  },
  {
    name: "quest_divider",
    label: "Quests",
    description:
      "Your adventure consists on a number of quests that the character must go on. You can either hand-create these quests or allow the LLM to generate them for each new player on the fly.",
    type: "divider",
  },
  {
    // VALIDATED
    name: "fixed_quest_arc",
    label: "Fixed Quest Arc",
    description: `Optional. If you wish for your adventure to have a fixed set of quests, define them here.`,
    type: "list",
    listof: "object",
    listSchema: [
      {
        name: "goal",
        label: "Goal",
        description: "The goal of the quest.",
        type: "text",
      },
      {
        name: "location",
        label: "Location",
        description: "The location of the quest.",
        type: "text",
      },
      {
        name: "description",
        label: "Description",
        description:
          "Optional description of the quest's desired characteristics.",
        type: "longtext",
      },
    ],
  },
  {
    // TODO: Validate int
    name: "quests_per_arc",
    label: "Quests per Arc",
    description: `If you don't have a pre-defined list of quests, this is how many will be generated`,
    type: "int",
    default: 10,
  },
  {
    name: "problem_divider",
    label: "Quest Problems",
    description:
      "Each time a character goes on a quest, they encounter problems they must solve. These problems are generated by the LLM. The following settings control how the LLM generates these problems.",
    type: "divider",
  },
  {
    // TODO: Validate int
    name: "min_problems_per_quest",
    label: "Minimum Problems per Quest",
    description: `What is the minimum number of problems a player must solve to complete a quest?`,
    type: "int",
    default: 2,
  },
  {
    // TODO: Validate int
    name: "problems_per_quest_scale",
    label: "Additional Problems per Quest Factor",
    description: `A number between 0 and 1. The higher this is, the more additional problems a user will have to solve above the minimum.`,
    type: "float",
    default: 0.25,
  },
  {
    // TODO: Validate int
    name: "max_additional_problems_per_quest",
    label: "Maximum additional problems per quest",
    description: `The maximum additional problems per quest that can be randomly added above and beyond the minimum required number.`,
    type: "int",
    default: 2,
  },
  {
    // TODO: Validate float
    name: "problem_solution_difficulty",
    label: "Problem difficulty scale factor",
    description: `The difficulty scale factor applied to the LLM’s estimation of how likely a user’s solution is to solve the problem.  User’s random number between (0,1) must exceed the modified value to succeed.

Base Values:
- VERY UNLIKELY=0.9
- UNLIKELY = 0.7
- LIKELY = 0.3
- VERY LIKELY = 0.1

Difficulty modified value:
1 - ((1-BASE_VALUE) / problem_solution_difficulty)

Result - Doubling difficulty makes success 1/2 as likely; halving difficulty makes success twice as likely.`,
    type: "float",
    default: 2,
  },
  {
    name: "advanced_divider",
    label: "Large Language Model Settings",
    description:
      "These advanced settings control the LLM that generates your story.",
    type: "divider",
  },
  {
    // Validated
    name: "default_story_model",
    label: "Story LLM Model",
    description: "Model used to generate story text.",
    type: "select",
    default: "gpt-3.5-turbo",
    options: [
      {
        value: "gpt-3.5-turbo",
        label: "GPT 3.5 Turbo",
      },
      {
        value: "gpt-4",
        label: "GPT 4",
      },
    ],
  },
  {
    // NEEDS WORK:
    // TODO: Add a post-processing step to coerce this to a float.
    name: "default_story_temperature",
    label: "Story LLM Temperature",
    description:
      "Temperature (creativity-factor) for the narrative generation. 0=Robot, 1=Bonkers, 0.4=Default",
    type: "float",
    default: 0.7,
  },
  {
    // NEEDS WORK:
    // TODO: Add a post-processing step to coerce this to an int.
    name: "default_story_max_tokens",
    label: "Story LLM Max Tokens",
    description:
      "Maximum number of tokens permitted during generation. 256=Default",
    type: "int",
    default: 512,
  },
];

export const CharacterOptions: Setting[] = [
  {
    // Validated
    name: "characters",
    label: "Pre-made Characters",
    description:
      "Each character you add here will be available to players staring a new game.",
    type: "list",
    listof: "object",
    listSchema: [
      {
        name: "name",
        label: "Name",
        description: "Name of the preset character.",
        type: "text",
      },
      {
        name: "image",
        label: "Image",
        description: "Image of the preset character.",
        type: "image",
      },
      {
        name: "tagline",
        label: "Tag Line",
        description: "A short tagline for your character.",
        type: "text",
      },
      {
        name: "description",
        label: "Description",
        description:
          "Description of the preset character. This influences gameplay.",
        type: "longtext",
      },
      {
        name: "background",
        label: "Background",
        description:
          "Background of the preset character. This influences gameplay.",
        type: "longtext",
      },
    ],
  },
];

export const VoiceOptions: Setting[] = [
  {
    // VALIDATED
    name: "narration_voice",
    label: "Narration Voice",
    description: "Voice used to generate narration.",
    type: "options",
    default: "adam",
    options: [
      {
        value: "dorothy",
        audioSample: "dorothy",
        label: "Dorothy",
        description: "British woman with a clear voice for storytelling.",
      },
      {
        value: "knightly",
        audioSample: "knightly",
        label: "Knightly",
        description:
          "Old British man. A deep and smooth voice for storytelling and podcast.",
      },
      {
        value: "oswald",
        audioSample: "oswald",
        label: "Oswald",
        description: "Intelligent Professor.",
      },
      {
        value: "marcus",
        audioSample: "marcus",
        label: "Marcus",
        description:
          "An authoritative and deep voice. Great for audio books or news.",
      },
      {
        value: "bria",
        audioSample: "bria",
        label: "Bria",
        description:
          "A young female with a softly spoken tone, perfect for storytelling or ASMR.",
      },
      {
        value: "alex",
        audioSample: "alex",
        label: "Alex",
        description: "Young american man. Is a strong and expressive narrator.",
      },
      {
        value: "valentino",
        audioSample: "valentino",
        label: "Valentino",
        description:
          "A great voice with depth. The voice is deep with a great accent, and works well for meditations.",
      },
      {
        value: "natasha",
        audioSample: "natasha",
        label: "Natasha",
        description: "A valley girl female voice. Great for shorts.",
      },
      {
        value: "brian",
        audioSample: "brian",
        label: "Brian",
        description: "Great voice for nature documentaries.",
      },
      {
        value: "joanne",
        audioSample: "joanne",
        label: "Joanne",
        description:
          "Young american woman. A soft and pleasant voice for a great character.",
      },
    ],
  },
];

export const MusicOptions: Setting[] = [
  {
    // VALIDATED
    name: "scene_music_generation_prompt",
    label: "Quest Music Prompt",
    description: `The prompt used to generate music for a quest.  Game tone and scene description will be filled in as {tone} and {description}.`,
    type: "longtext",
    default:
      "16-bit game score for a quest game scene. {tone}. Scene description: {description}",
  },
  {
    // VALIDATED
    name: "camp_music_generation_prompt",
    label: "Camp Music Prompt",
    description: `The prompt used to generate music for camp.  Game tone will filled in as {tone}.`,
    type: "longtext",
    default: "background music for a quest game camp scene. {tone}.",
  },
  {
    // VALIDATED
    name: "music_duration",
    label: "Music Duration",
    description: `Duration of music to generate. Default=10. Max=30. IMPORTANT: Values less than 15 are safest because generation takes so long.`,
    type: "int",
    default: 10,
  },
];

export const ImageOptions: Setting[] = [
  {
    type: "divider",
    name: "profile-divider",
    label: "Profile Images",
    description:
      "Set the theme and prompt for generating player profile images.",
  },
  {
    // VALIDATED
    name: "profile_image_theme",
    label: "Profile Image Theme",
    description: `Use a pre-made theme or add more in the **Image Themes** tab.`,
    type: "select",
    options: DEFAULT_THEMES,
    default: "pixel_art_1",
    includeDynamicOptions: "image-themes",
  },
  {
    // VALIDATED
    name: "profile_image_prompt",
    label: "Profile Image Prompt",
    description:
      "The prompt that will be used to generate the player's profile image. The variables {name} and {description} can be used.",
    type: "longtext",
    default: "close-up profile picture, focus on head, {name}, {description}",
  },
  {
    // VALIDATED
    name: "profile_image_negative_prompt",
    label: "Profile Image Negative Prompt",
    description: "The negative prompt for generating profile images.",
    type: "longtext",
    default: "",
  },
  {
    type: "divider",
    name: "item-divider",
    label: "Item Images",
    description:
      "Set the theme and prompt for generating images for items found on quests.",
  },
  {
    // VALIDATED
    name: "item_image_theme",
    label: "Item Image Theme",
    description: `Use a pre-made theme or add more in the **Image Themes** tab.`,
    type: "select",
    options: DEFAULT_THEMES,
    default: "pixel_art_1",
    includeDynamicOptions: "image-themes",
  },
  {
    // VALIDATED
    name: "item_image_prompt",
    label: "Item Image Prompt",
    description: "The prompt used to generate item images.",
    type: "longtext",
    default: `16-bit retro-game sprite for an {name}, {description}`,
  },
  {
    // VALIDATED
    name: "item_image_negative_prompt",
    label: "Item Image Negative Prompt",
    description: "The negative prompt for generating item images.",
    type: "longtext",
    default: "",
  },
  {
    type: "divider",
    name: "camp-divider",
    label: "Camp Images",
    description:
      "Set the theme and prompt for generating images for the camp background.",
  },
  {
    // VALIDATED
    name: "camp_image_theme",
    label: "Camp Image Theme",
    description: `Use a pre-made theme or add more in the **Image Themes** tab.`,
    type: "select",
    options: DEFAULT_THEMES,
    default: "pixel_art_1",
    includeDynamicOptions: "image-themes",
  },
  {
    // VALIDATED
    name: "camp_image_prompt",
    label: "Camp Image Prompt",
    description: `Prompt for generating the camp image.
    
You can use the following variables:
  - {tone} for the tone of the story
  - {genre} for the genre of the story.

Example: 

  {tone} {genre} camp.
        
    `,
    type: "longtext",
    default: "{tone} {genre} camp.",
  },
  {
    // VALIDATED
    name: "camp_image_negative_prompt",
    label: "Camp Image Negative Prompt",
    description: "Negative prompt for generating camp images.",
    type: "longtext",
    default: "",
  },
  {
    type: "divider",
    name: "quest-divider",
    label: "Quest Images",
    description: "Set the theme and prompt for generating in-quest images.",
  },
  {
    // VALIDATED
    name: "quest_background_theme",
    label: "Quest Background Theme",
    description: `Use a pre-made theme or add more in the **Image Themes** tab.`,
    type: "select",
    options: DEFAULT_THEMES,
    default: "pixel_art_1",
    includeDynamicOptions: "image-themes",
  },
  {
    // VALIDATED
    name: "quest_background_image_prompt",
    label: "Quest Background Prompt",
    description: "The prompt for generating a quest background.",
    type: "longtext",
    default: `16-bit background scene for a quest. The scene being depicted is: {description}`,
  },
  {
    // VALIDATED
    name: "quest_background_image_negative_prompt",
    label: "Quest Background Negative Prompt",
    description: "The negative prompt for generating quest background.",
    type: "longtext",
    default: "",
  },
];

export const GameEngineOptions: Setting[] = [
  {
    name: "game_engine_version",
    label: "Version",
    description:
      "Game engine version this Adventure should use. Only values of the form `ai-adventure@VERSION` will be saved. Replace VERSION with the desired version.",
    type: "text",
    default: "",
  },
];

export const ImageThemeOptions: Setting[] = [
  {
    // VALIDATED
    name: "image_themes",
    label: "Image Themes",
    description: `Themes available to use in image generation. Reference these from the **Camp**, **Quests**, and **Items** settings pages.`,
    type: "list",
    listof: "object",
    listSchema: [
      {
        name: "name",
        label: "Name",
        description: "Name of the theme.",
        type: "text",
      },
      {
        name: "prompt_prefix",
        label: "Prompt Prefix",
        description:
          "Any extra words, including trigger words for LoRAs in this theme. Include a comma and spacing if you require it.",
        type: "longtext",
      },
      {
        name: "prompt_suffix",
        label: "Prompt Suffix",
        description:
          "Any extra words, including trigger words for LoRAs in this theme. Include a command and spacing if you require it.",
        type: "longtext",
      },
      {
        name: "negative_prompt_prefix",
        label: "Negative Prompt Prefix",
        description:
          "Any extra words, including trigger words for LoRAs in this theme. Include a comma and spacing if you require it.",
        type: "longtext",
      },
      {
        name: "negative_prompt_suffix",
        label: "Negative Prompt Suffix",
        description:
          "Any extra words, including trigger words for LoRAs in this theme. Include a command and spacing if you require it.",
        type: "longtext",
      },
      {
        name: "model",
        label: "Generation Model",
        description: "Which model to use.",
        type: "select",
        options: [
          {
            label: "Stable Diffusion 1.5",
            value: "runwayml/stable-diffusion-v1-5",
          },
          {
            label: "Stable Diffusion XL 1.0",
            value: "stabilityai/stable-diffusion-xl-base-1.0",
          },
        ],
      },
      {
        name: "loras",
        label: "Loras",
        description: "List of LoRAs to use for image generation",
        type: "list",
        listof: "text",
      },
      {
        name: "seed",
        label: "Random Seed",
        description:
          "The same seed and prompt passed to the same version of StableDiffusion will output the same image every time.",
        type: "int",
        default: -1,
      },
      {
        name: "num_inference_steps",
        label: "Num Inference Steps",
        description:
          "Increasing the number of steps tells Stable Diffusion that it should take more steps to generate your final result which can increase the amount of detail in your image.",
        type: "int",
        default: 30,
      },
      {
        name: "guidance_scale",
        label: "Guidance Scale",
        description:
          "The CFG(Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.",
        type: "float",
        default: 7.5,
      },
      {
        name: "clip_skip",
        label: "Clip Skip",
        description:
          "Skips part of the image generation process, leading to slightly different results. This means the image renders faster, too.",
        type: "int",
        default: 0,
      },
      {
        name: "scheduler",
        label: "Scheduler",
        description:
          "Scheduler (or sampler) to use for the image denoising process.",
        type: "select",
        options: [
          {
            label: "DPM++ 2M",
            value: "DPM++ 2M",
          },
          {
            label: "DPM++ 2M Karras",
            value: "DPM++ 2M Karras",
          },
          {
            label: "DPM++ 2M SDE",
            value: "DPM++ 2M SDE",
          },
          {
            label: "DPM++ 2M SDE Karras",
            value: "DPM++ 2M SDE Karras",
          },
          {
            label: "Euler",
            value: "Euler",
          },
          {
            label: "Euler A",
            value: "Euler A",
          },
        ],
      },
    ],
  },
];

export const SettingGroups: SettingGroup[] = [
  {
    spacer: true,
    title: "General",
  },
  {
    title: "General Settings",
    description: "Settings for your game.",
    href: "general-settings",
    settings: GeneralOptions,
  },
  {
    spacer: true,
    title: "Game",
  },
  {
    title: "Story",
    description: "The quests and challenges for your adventure.",
    href: "story-options",
    settings: StoryOptions,
  },
  {
    title: "Characters",
    description: "Offer pre-made characters to your game players.",
    href: "character-options",
    settings: CharacterOptions,
  },
  {
    title: "Images",
    description: "Control the generation of your story's images.",
    href: "image-options",
    settings: ImageOptions,
  },
  {
    title: "Voices",
    description: "Settings that control your story's voice narration.",
    href: "voice-options",
    settings: VoiceOptions,
  },
  {
    title: "Music",
    description: "Settings that control your story's music generation.",
    href: "music-options",
    settings: MusicOptions,
  },

  {
    spacer: true,
    title: "Advanced",
  },
  {
    title: "Image Themes",
    description: "Create stable diffusion themes for image generation.",
    href: "image-themes",
    settings: ImageThemeOptions,
  },
  {
    title: "Game Engine",
    description: "The AI Agent hosted on Steamship.com powering the game.",
    href: "game-engine",
    settings: GameEngineOptions,
  },
  {
    title: "Import",
    description:
      "Import an entire adventure template at once by pasting exported YAML and clicking Save.",
    href: "import",
  },
  {
    title: "Export",
    description:
      "Save or share your adventure settings by copying this block of YAML code.",
    href: "export",
  },
];
