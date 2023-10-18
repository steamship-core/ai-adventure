"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import CharacterCreationIntro from "./intro";
import OnboardingPrompt from "./onboarding-prompt";
import { CreationContainer } from "./shared/components";

export default function CharacterCreation() {
  const searchParams = useSearchParams();
  const isCompleteConfig =
    searchParams.has("genre") &&
    searchParams.has("tone") &&
    searchParams.has("name") &&
    searchParams.has("appearance") &&
    searchParams.has("background");

  const [activeStep, setActiveStep] = useState(isCompleteConfig ? 6 : 0);
  const [step, setStep] = useState(isCompleteConfig ? 7 : 0);

  const [configuration, setConfiguration] = useState<CharacterConfig>({
    player: {
      name: isCompleteConfig ? searchParams.get("name")! : "",
      description: isCompleteConfig ? searchParams.get("appearance")! : "",
      background: isCompleteConfig ? searchParams.get("background")! : "",
      rank: 1,
      energy: 100,
      max_energy: 100,
      gold: 0,
      inventory: [],
      motivation: "",
    },
    genre: isCompleteConfig ? searchParams.get("theme")! : "",
    tone: isCompleteConfig ? searchParams.get("tone")! : "",
    camp: {
      human_players: [],
      npcs: [],
      name: "Camp",
    },
    quests: [],
  });

  const steps = [
    {
      placeholder: "Fantasy, steampunk, pirate/high-seas, viking, etc..",
      text: "Set the theme of the adventure. This will determine the setting and genre of the story you will be playing.",
      buttonText: "Set theme",
      options: ["Fantasy", "Steampunk", "Horror"],
      setConfiguration: (genre: string) => {
        setConfiguration({
          ...configuration,
          genre,
        });
      },
    },
    {
      placeholder: "Serious, silly, dark, light, etc..",
      text: "What is the tone of the story? Serious, silly, dark, light, etc..",
      buttonText: "Set tone",
      options: ["Serious", "Silly", "Dark"],
      setConfiguration: (tone: string) => {
        setConfiguration({
          ...configuration,
          tone,
        });
      },
    },
    {
      placeholder: "Thumblemore the Often-Lost",
      text: "Choose a name for your character. This can be anything you want!",
      buttonText: "Set name",
      setConfiguration: (name: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, name },
        });
      },
    },
    {
      placeholder:
        "Thumblemore is a disheveled wizard with silver-white hair that cascades wildly, often obscuring his dazed blue eyes. He wears azure robes dotted with confusing maps and compasses, all misleadingly pointing in various directions. Around his neck dangle mismatched amulets from many misadventures, while he leans on a crooked staff etched with arcane symbols, some seemingly corrected in haste. His twisty beard seems to harbor its own mysteries, much like the rest of him.",
      text: "Describe your character's appearence. An image will be generated based on your description - so be as detailed as you want!",
      buttonText: "Set appearance",
      setConfiguration: (description: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, description },
        });
      },
    },
    {
      placeholder:
        "Born to a noble family, your character has always had everything they wanted... until now.",
      text: "Set the background of your character. Is your character a noble, a peasant, a thief - maybe a wizard or a knight?",
      buttonText: "Set background",
      setConfiguration: (background: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, background },
        });
      },
    },
    {
      placeholder: "To become the most powerful wizard in the land.",
      text: "What primary motivation does your character have? This will be used to generate quests and storylines for your character.",
      buttonText: "Set motivation",
      setConfiguration: (motivation: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, motivation },
        });
      },
    },
  ];

  return (
    <CreationContainer>
      {step > 6 && (
        <CharacterCreationComplete
          config={configuration}
          onFocus={() => setActiveStep(7)}
          isCurrent={activeStep === 7}
        />
      )}
      {steps
        .map((stepConfig, index) => {
          if (index + 1 > step) return null;
          return (
            <OnboardingPrompt
              setStep={setStep}
              setActiveStep={setActiveStep}
              isCurrent={activeStep === index + 1}
              totalSteps={6}
              key={stepConfig.text}
              step={index + 1}
              {...stepConfig}
            />
          );
        })
        .reverse()}
      <CharacterCreationIntro
        onContinue={() => {
          setStep(1);
          setActiveStep(1);
        }}
        isCurrent={activeStep === 0}
      />
    </CreationContainer>
  );
  return null;
}
