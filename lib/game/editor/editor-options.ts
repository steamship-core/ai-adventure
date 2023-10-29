export type OptionValue = {
  value: string;
  label: string;
  description?: string;
};

export type Setting = {
  name: string;
  label: string;
  description: string;
  type: "select" | "text" | "longtext" | "options" | "boolean";
  default?: string;
  options?: OptionValue[];
  required?: boolean;
};

export type SettingGroup = {
  spacer?: boolean;
  title: string;
  description?: string;
  href?: string;
  settings?: Setting[];
};

export const GeneralOptions: Setting[] = [
  {
    name: "adventure_name",
    label: "Adventure Name",
    description: "What name will others see this adventure by?",
    type: "text",
    default: "",
    required: true,
  },
];

export const WorldOptions: Setting[] = [
  {
    name: "TODO",
    label: "World Description",
    description: "What name will others see this adventure by?",
    type: "longtext",
    default: "",
    required: true,
  },
];

export const CampOptions: Setting[] = [
  {
    name: "camp_image_theme",
    label: "Camp Image Theme",
    description: `The theme name for generating camp image.

Use a built-in theme:
*  \`pixel_art_1\`
*  \`pixel_art_2\`

Or reference one you have defined in the **Image Settings** tab.`,
    type: "text",
    default: "pixel_art_1",
  },
  {
    name: "camp_image_prompt",
    label: "Camp Image Prompt",
    description: "The theme name for generating camp image.",
    type: "longtext",
    default: "{tone} {genre} camp.",
  },
  {
    name: "camp_image_negative_prompt",
    label: "Camp Image Negative Prompt",
    description: "The negative prompt for generating camp images.",
    type: "longtext",
    default: "",
  },
];

export const PlayerAppearanceOptions: Setting[] = [
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
];

export const ItemOptions: Setting[] = [
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
];

export const QuestOptions: Setting[] = [
  {
    name: "TODO",
    label: "Number of quests in an adventure.",
    description: "The number of quests to encounter in an adventure.",
    type: "text",
    default: "3",
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

export const ObstacleOptions: Setting[] = [
  {
    name: "TODO",
    label: "Number of obstacles in quest",
    description: "The number of obstacles to encounter in a quest.",
    type: "text",
    default: "3",
  },
  {
    name: "TODO",
    label: "Consider realism of player response?",
    description:
      "Whether to consider realism in the player's response to obstacles.",
    type: "boolean",
    default: "true",
  },
];

export const VoiceModelOptions: Setting[] = [
  {
    name: "default_narration_model",
    label: "Narration Voice",
    description: "Voice used to generate narration.",
    type: "options",
    default: "adam",
    options: [
      {
        value: "adam",
        label: "Adam",
        description: "A standard American English accent.",
      },
      {
        value: "knightly",
        label: "Knightly",
        description:
          "Old male british man. A deep and smooth voice for storytelling and podcast.",
      },
      {
        value: "oswald",
        label: "Oswald",
        description: "Intelligent Professor.",
      },
      {
        value: "marcus",
        label: "Marcus",
        description:
          "An authoritative and deep voice. Great for audio books or news.",
      },
      {
        value: "bria",
        label: "Bria",
        description:
          "A young female with a softly spoken tone, perfect for storytelling or ASMR.",
      },
      {
        value: "alex",
        label: "Alex",
        description: "Young american man. Is a strong and expressive narrator.",
      },
      {
        value: "valentino",
        label: "Valentino",
        description:
          "A great voice with depth. The voice is deep with a great accent, and works well for meditations.",
      },
      {
        value: "natasha",
        label: "Natasha",
        description: "A valley girl female voice. Great for shorts.",
      },
      {
        value: "brian",
        label: "Brian",
        description: "Great voice for nature documentaries.",
      },
      {
        value: "joanne",
        label: "Joanne",
        description:
          "Young american woman. A soft and pleasant voice for a great character.",
      },
    ],
  },
];

export const ImageModelOptions: Setting[] = [];

export const NarrativeModelOptions: Setting[] = [
  {
    name: "TODO",
    label: "Writing Style",
    description: `The general style of story writing.

This is used to generate the narrator's general style and will be an instruction to the AI.

Fill this in as if it was the instruction in a page of short notes to an actor.`,
    type: "longtext",
    default: "Short and pithy. Writes like a poet. Uses lots of metaphors.",
  },
  {
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
    name: "default_story_temperature",
    label: "Story LLM Temperature",
    description:
      "Temperature (creativity-factor) for the narrative generation. 0=Robot, 1=Bonkers, 0.4=Default",
    type: "text",
    default: "0.4",
  },
  {
    name: "default_story_max_tokens",
    label: "Story LLM Max Tokens",
    description:
      "Maximum number of tokens permitted during generation. 256=Default",
    type: "text",
    default: "256",
  },
];

export const SettingGroups: SettingGroup[] = [
  {
    title: "General Settings",
    description: "Settings for your game.",
    href: "/adventures/editor/general-settings",
    settings: GeneralOptions,
  },
  {
    spacer: true,
    title: "Player Design",
  },
  {
    title: "Appearance",
    description: "How players will appear.",
    href: "/adventures/editor/player-appearance-settings",
    settings: PlayerAppearanceOptions,
  },
  {
    title: "Pre-made Characters",
    description: "Suggested characters.",
    href: "/adventures/editor/player-suggestions",
    settings: PlayerAppearanceOptions,
  },
  {
    spacer: true,
    title: "Game Design",
  },
  {
    title: "World",
    description: "Settings for a quest.",
    href: "/adventures/editor/world-settings",
    settings: WorldOptions,
  },
  {
    title: "Camp",
    description: "Settings for camp.",
    href: "/adventures/editor/camp-settings",
    settings: CampOptions,
  },
  {
    title: "Quests",
    description: "Settings for a quest.",
    href: "/adventures/editor/quest-settings",
    settings: QuestOptions,
  },
  {
    title: "Obstacles",
    description: "Settings for a quest.",
    href: "/adventures/editor/obstacle-settings",
    settings: ObstacleOptions,
  },
  {
    title: "Items",
    description: "Settings for item generation.",
    href: "/adventures/editor/item-settings",
    settings: ItemOptions,
  },
  {
    spacer: true,
    title: "Creative Direction",
  },
  {
    title: "Writing",
    description: "Settings that control your story.",
    href: "/adventures/editor/language-model",
    settings: NarrativeModelOptions,
  },
  {
    title: "Narration",
    description: "Settings that control your story's narration.",
    href: "/adventures/editor/voice-model",
    settings: VoiceModelOptions,
  },
  {
    title: "Artwork",
    description: "Settings that control your story's image generation.",
    href: "/adventures/editor/image-model",
    settings: ImageModelOptions,
  },
];
