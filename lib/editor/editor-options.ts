export type OptionValue = {
  value: string;
  label: string;
  audioSample?: string;
  description?: string;
};

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
    | "image";
  listof?: "object" | "text";
  default?: string;
  options?: OptionValue[];
  includeDynamicOptions?: "image-themes";
  required?: boolean;
  unused?: boolean;
  listSchema?: Setting[];
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
  return topLevelUpdates;
}

export const GeneralOptions: Setting[] = [
  {
    name: "adventure_name",
    label: "Adventure Name",
    description: "What name will others see this adventure by?",
    type: "text",
    default: "",
    required: true,
  },
  {
    name: "adventure_genre",
    label: "Genre",
    description: "What genre is this adventure? E.g.: Fantasy, Sci-Fi, etc.",
    type: "text",
    default: "",
  },
  {
    name: "adventure_tone",
    label: "Tone",
    description:
      "What is the tone of this adventure? E.g.: Serious, Silly, etc.",
    type: "text",
    default: "",
  },
  {
    name: "adventure_public",
    label: "Public",
    description:
      "NOTE: Only approved users can set an adventure to public. Ask in steamship.com/discord.",
    type: "boolean",
  },
  {
    name: "adventure_short_description",
    label: "Short Description",
    description: "What one-sentence description describes this adventure",
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

export const StoryOptions: Setting[] = [
  {
    name: "TODO",
    label: "World Description",
    description: "What name will others see this adventure by?",
    type: "longtext",
    default: "",
    required: true,
    unused: true,
  },
  {
    name: "TODO - Obstacles",
    label: "Number of obstacles in quest",
    description: "The number of obstacles to encounter in a quest.",
    type: "text",
    default: "3",
    unused: true,
  },
  {
    name: "TODO - Realism",
    label: "Consider realism of player response?",
    description:
      "Whether to consider realism in the player's response to obstacles.",
    type: "boolean",
    default: "true",
    unused: true,
  },
  {
    name: "TODO",
    label: "Number of quests in an adventure.",
    description: "The number of quests to encounter in an adventure.",
    type: "text",
    default: "3",
    unused: true,
  },
];

export const CharacterOptions: Setting[] = [
  {
    name: "characters",
    label: "Characters",
    description: "Characters",
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
      {
        name: "motivation",
        label: "Motivation",
        description:
          "Motivation of the preset character. This influences gameplay.",
        type: "longtext",
      },
    ],
  },
];

export const VoiceOptions: Setting[] = [
  {
    name: "default_narration_model",
    label: "Narration Voice",
    description: "Voice used to generate narration.",
    type: "options",
    default: "adam",
    unused: true,
    options: [
      {
        value: "knightly",
        audioSample: "knightly",
        label: "Knightly",
        description:
          "Old male british man. A deep and smooth voice for storytelling and podcast.",
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
    name: "music_prompt",
    label: "Music Prompt",
    description: `The prompt for generating background music.`,
    type: "longtext",
    default: "",
  },
];

export const ImageOptions: Setting[] = [
  {
    name: "profile_image_theme",
    label: "Profile Image Theme",
    description: `The theme name for generating profile image.

Use a built-in theme:
*  \`pixel_art_1\`
*  \`pixel_art_2\`

Or reference one you have defined in the **Image Settings** tab.`,
    type: "text",
    default: "pixel_art_1",
  },
  {
    name: "profile_image_prompt",
    label: "Profile Image Prompt",
    description: "The theme name for generating profile image.",
    type: "longtext",
    default: "{tone} {genre} profile picture.",
  },
  {
    name: "profile_image_negative_prompt",
    label: "Profile Image Negative Prompt",
    description: "The negative prompt for generating profile images.",
    type: "longtext",
    default: "",
  },
  {
    name: "item_image_theme",
    label: "Item Image Theme",
    description: `The theme name for generating item image.

Use a built-in theme:
*  \`pixel_art_1\`
*  \`pixel_art_2\`

Or reference one you have defined in the **Image Settings** tab.`,
    type: "text",
    default: "pixel_art_1",
  },
  {
    name: "camp_image_prompt",
    label: "Item Image Prompt",
    description: "The theme name for generating item image.",
    type: "longtext",
    default: `16-bit retro-game sprite for an item in a hero's inventory.
The items's name is: {name}.
The item's description is: {description}.`,
  },
  {
    name: "camp_image_negative_prompt",
    label: "Item Image Negative Prompt",
    description: "The negative prompt for generating item images.",
    type: "longtext",
    default: "",
  },
  {
    name: "items",
    label: "Items Possible to Get",
    description: "The list of items to grant a person.",
    type: "list",
    listof: "text",
    default: "",
    unused: true,
  },
  {
    name: "camp_image_theme",
    label: "Camp Image Theme",
    description: `The theme name for generating camp image.

Use a pre-selected theme or add more in the **Image Settings** tab.`,
    type: "select",
    options: [
      {
        value: "pixel_art_1",
        label: "pixel_art_1",
      },
      {
        value: "pixel_art_2",
        label: "pixel_art_2",
      },
    ],
    default: "pixel_art_1",
    includeDynamicOptions: "image-themes",
  },
  {
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
    name: "camp_image_negative_prompt",
    label: "Camp Image Negative Prompt",
    description: "Negative prompt for generating camp images.",
    type: "longtext",
    default: "",
  },
  {
    name: "quest_background_theme",
    label: "Quest Background Theme",
    description: `The theme name for generating a quest background.

Use a built-in theme:
*  \`pixel_art_1\`
*  \`pixel_art_2\`

Or reference one you have defined in the **Image Settings** tab.`,
    type: "text",
    default: "pixel_art_1",
  },
  {
    name: "quest_background_prompt",
    label: "Quest Background Prompt",
    description: "The prompt for generating a quest background.",
    type: "longtext",
    default: `16-bit retro-game sprite for an item in a hero's inventory.
The items's name is: {name}.
The item's description is: {description}.`,
  },
  {
    name: "quest_background_negative_prompt",
    label: "Quest Background Negative Prompt",
    description: "The negative prompt for generating quest background.",
    type: "longtext",
    default: "",
  },
];

export const ImageThemeOptions: Setting[] = [
  {
    name: "themes",
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
        label: "Prompt",
        description:
          "Any extra words, including trigger words for LoRAs in this theme. Include a command and spacing if you require it.",
        type: "longtext",
      },
      {
        name: "negative_prompt_prefix",
        label: "Negative Prompt Suffix",
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
        type: "text",
      },
      {
        name: "num_inference_steps",
        label: "Num Inference Steps",
        description:
          "Increasing the number of steps tells Stable Diffusion that it should take more steps to generate your final result which can increase the amount of detail in your image.",
        type: "text",
      },
      {
        name: "guidance_scale",
        label: "Guidance Scale",
        description:
          "The CFG(Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.",
        type: "text",
      },
      {
        name: "clip_skip",
        label: "Clip Skip",
        description:
          "Skips part of the image generation process, leading to slightly different results. This means the image renders faster, too.",
        type: "text",
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
    unused: true,
  },
];

export const NarrativeModelOptions: Setting[] = [
  {
    name: "TODO",
    label: "Writing Style",
    description: `The general style of story writing.

This is used to generate the narrator's general style and will be an instruction to the AI.

Fill this in as if it was the instruction in a page of short notes to an actor.`,
    type: "longtext",
    default: "Short and pithy. Writes like a poet. Uses lots of metaphors.",
    unused: true,
  },
  {
    name: "default_story_model",
    label: "Story LLM Model",
    description: "Model used to generate story text.",
    type: "select",
    default: "gpt-3.5-turbo",
    unused: true,
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
    name: "default_story_temperature",
    label: "Story LLM Temperature",
    description:
      "Temperature (creativity-factor) for the narrative generation. 0=Robot, 1=Bonkers, 0.4=Default",
    type: "text",
    default: "0.4",
    unused: true,
  },
  {
    name: "default_story_max_tokens",
    label: "Story LLM Max Tokens",
    description:
      "Maximum number of tokens permitted during generation. 256=Default",
    type: "text",
    default: "256",
    unused: true,
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
    description: "Pre-made characters for play.",
    href: "character-options",
    settings: CharacterOptions,
  },
  {
    title: "Image",
    description: "Settings that control your story's image generation.",
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
