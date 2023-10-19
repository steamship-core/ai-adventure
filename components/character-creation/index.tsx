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
  const [isCompleteConfig, setIsCompleteConfig] = useState(
    searchParams.has("genre") &&
      searchParams.has("tone") &&
      searchParams.has("name") &&
      searchParams.has("description") &&
      searchParams.has("background") &&
      searchParams.has("motivation")
  );

  const [activeStep, setActiveStep] = useState(isCompleteConfig ? 7 : 0);
  const [step, setStep] = useState(isCompleteConfig ? 7 : 0);

  const [configuration, setConfiguration] = useState<CharacterConfig>({
    player: {
      name: searchParams.get("name") || "",
      description: searchParams.get("description") || "",
      background: searchParams.get("background") || "",
      motivation: searchParams.get("motivation") || "",
      rank: 1,
      energy: 100,
      gold: 0,
      inventory: [],
    },
    genre: searchParams.get("genre") || "",
    tone: searchParams.get("tone") || "",
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
      options: ["Fantasy", "Futuristic", "Mystery"],
      initialValue: configuration.genre,
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
      initialValue: configuration.tone,
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
      initialValue: configuration.player.name,
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
      initialValue: configuration.player.description,
      setConfiguration: (description: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, description },
        });
      },
    },
    {
      placeholder:
        "Thumblemore was once a prodigious student at the Arcanum Academy, but an experiment gone awry with a teleportation spell left his sense of direction—both physically and magically—utterly skewed. Despite his frequent misadventures and unintended destinations, his heart remains as true as his compass is not. Each mishap, from conversing with trees to accidentally attending dragon conventions, has only enriched his knowledge, making him an unexpected, yet invaluable, repository of arcane oddities.",
      text: "Set the background of your character. Is your character a noble, a peasant, a thief - maybe a wizard or a knight?",
      buttonText: "Set background",
      initialValue: configuration.player.background,
      setConfiguration: (background: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, background },
        });
      },
    },
    {
      placeholder:
        'Thumblemore\'s primary goal is to find the elusive "True North" spell, an ancient and forgotten magic rumored to correct any misdirection, whether physical or arcane. He believes that with this spell, he can finally regain his once impeccable magical precision and stop his unintentional jaunts into the unknown—though a part of him has grown fond of the unexpected adventures his "condition" brings.',
      text: "What primary motivation does your character have? This will be used to generate quests and storylines for your character.",
      buttonText: "Set motivation",
      initialValue: configuration.player.motivation,
      setConfiguration: (motivation: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, motivation },
        });
      },
    },
  ];

  const editCharacterFromTemplate = () => {
    setIsCompleteConfig(false);

    console.log("setting active step to 0");
    setActiveStep(0);
    setStep(0);
  };

  console.log("activeStep", activeStep);
  console.log("step", step);

  return (
    <CreationContainer>
      {step > 6 && (
        <CharacterCreationComplete
          config={configuration}
          onFocus={() => {
            console.log("setting active step to 7");
            setActiveStep(7);
          }}
          isCurrent={activeStep === 7}
          isCompleteConfig={isCompleteConfig}
          editCharacterFromTemplate={editCharacterFromTemplate}
        />
      )}
      {!isCompleteConfig && (
        <>
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
        </>
      )}
    </CreationContainer>
  );
  return null;
}
