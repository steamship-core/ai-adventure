"use client";
import CharacterCreationIntro from "./intro";
import { useState } from "react";
import { CreationContainer } from "./shared/components";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import { useSearchParams } from "next/navigation";
import OnboardingPrompt from "./onboarding-prompt";

export default function CharacterCreation() {
  const searchParams = useSearchParams();
  const isCompleteConfig =
    searchParams.has("genre") &&
    searchParams.has("tone") &&
    searchParams.has("name") &&
    searchParams.has("appearance") &&
    searchParams.has("background");

  const [activeStep, setActiveStep] = useState(isCompleteConfig ? 6 : 0);
  const [step, setStep] = useState(isCompleteConfig ? 6 : 0);

  const [configuration, setConfiguration] = useState<CharacterConfig>({
    player: {
      name: isCompleteConfig ? searchParams.get("name")! : "",
      description: isCompleteConfig ? searchParams.get("appearance")! : "",
      background: isCompleteConfig ? searchParams.get("background")! : "",
      rank: 1,
      energy: 100,
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

  return (
    <CreationContainer>
      {step > 5 && (
        <CharacterCreationComplete
          config={configuration}
          onFocus={() => setActiveStep(6)}
          isCurrent={activeStep === 6}
        />
      )}
      {step > 4 && (
        <OnboardingPrompt
          onContinue={(background) => {
            setStep(6);
            setActiveStep(6);
            setConfiguration({
              ...configuration,
              player: {
                ...configuration.player,
                background,
              },
            });
          }}
          onFocus={() => setActiveStep(5)}
          isCurrent={activeStep === 5}
          placeholder="Born to a noble family, your character has always had everything they wanted... until now."
          text="Set the background of your character. Is your character a noble, a peasant, a thief - maybe a wizard or a knight?"
          isTextarea
        />
      )}
      {step > 3 && (
        <OnboardingPrompt
          onContinue={(description) => {
            setStep(5);
            setActiveStep(5);
            setConfiguration({
              ...configuration,
              player: {
                ...configuration.player,
                description,
              },
            });
          }}
          onFocus={() => setActiveStep(4)}
          isCurrent={activeStep === 4}
          placeholder="An old, wise, wizard with a long white beard and a pointy hat."
          text="Describe your character's appearence. An image will be generated based on your description - so be as detailed as you want!"
          isTextarea
        />
      )}
      {step > 2 && (
        <OnboardingPrompt
          onContinue={(name) => {
            setStep(4);
            setActiveStep(4);
            setConfiguration({
              ...configuration,
              player: {
                ...configuration.player,
                name,
              },
            });
          }}
          onFocus={() => setActiveStep(3)}
          isCurrent={activeStep === 3}
          text="Choose a name for your character. This can be anything you want!"
          placeholder="Professor Chaos"
        />
      )}
      {step > 1 && (
        <OnboardingPrompt
          onContinue={(tone) => {
            setStep(3);
            setActiveStep(3);
            setConfiguration({ ...configuration, tone });
          }}
          onFocus={() => {
            setActiveStep(2);
          }}
          isCurrent={activeStep === 2}
          placeholder="Serious, silly, dark, light, etc.."
          text="What is the tone of the story? Serious, silly, dark, light, etc.."
        />
      )}
      {step > 0 && (
        <OnboardingPrompt
          onContinue={(genre) => {
            setStep(2);
            setActiveStep(2);
            setConfiguration({ ...configuration, genre });
          }}
          onFocus={() => {
            setActiveStep(1);
          }}
          isCurrent={activeStep === 1}
          placeholder="Fantasy, steampunk, pirate/high-seas, viking, etc.."
          text="Set the theme of the adventure. This will determine the setting and genre of the story you will be playing."
        />
      )}
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
