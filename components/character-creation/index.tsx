"use client";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import CharacterCreationIntro from "./intro";
import OnboardingPrompt from "./onboarding-prompt";
import { CreationContainer } from "./shared/components";

const MAX_STEPS = 7;

const ProgressPoint = ({
  setActiveStep,
  activeStep,
  index,
  completedSteps,
}: {
  setActiveStep: Dispatch<SetStateAction<number>>;
  activeStep: number;
  index: number;
  completedSteps: Set<number>;
}) => {
  const [springs, api] = useSpring(() => ({
    from: { scale: 1, opacity: 0.5 },
  }));

  useEffect(() => {
    if (activeStep === index) {
      api.start({ scale: 2, opacity: 1 });
    } else {
      api.start({ scale: 1, opacity: 0.5 });
    }
  }, [activeStep]);

  return (
    <animated.button
      className={cn(
        "bg-foreground rounded-full flex items-center justify-center h-3 w-3",
        activeStep === index && "bg-foreground",
        completedSteps.has(index) && activeStep !== index && "bg-blue-500"
      )}
      onClick={() => setActiveStep(index)}
      style={{
        ...springs,
      }}
    ></animated.button>
  );
};

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

  const [activeStep, setActiveStep] = useState(
    isCompleteConfig ? MAX_STEPS : 0
  );
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());

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
      options: ["Fantasy", "Realistic", "Mystery"],
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
      text: "Choose a name for your character.",
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
        "Thumblemore is a disheveled wizard with silver-white hair that cascades wildly, ...",
      text: "Describe your character's appearance. An image will be generated based on your description - so be as detailed as you want!",
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
        "Thumblemore was once a prodigious student at the Arcanum Academy, ...",
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
        'Thumblemore\'s primary goal is to find the elusive "True North" spell, an ancient ...',
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
    setActiveStep(0);
  };

  return (
    <CreationContainer>
      <div className="flex items-end flex-1 w-full">
        {activeStep === MAX_STEPS && (
          <CharacterCreationComplete
            config={configuration}
            isCurrent={activeStep === MAX_STEPS}
            isCompleteConfig={isCompleteConfig}
            editCharacterFromTemplate={editCharacterFromTemplate}
            setActiveStep={setActiveStep}
          />
        )}
        {steps
          .map((stepConfig, index) => {
            if (index + 1 !== activeStep) return null;
            return (
              <OnboardingPrompt
                setActiveStep={setActiveStep}
                isCurrent={activeStep === index + 1}
                totalSteps={MAX_STEPS - 1}
                key={stepConfig.text}
                step={index + 1}
                setCompletedSteps={setCompletedSteps}
                completedSteps={completedSteps}
                {...stepConfig}
              />
            );
          })
          .reverse()}
        {activeStep === 0 && (
          <CharacterCreationIntro
            onContinue={() => {
              setCompletedSteps((prev) => prev.add(0));
              setActiveStep(1);
            }}
            completedSteps={completedSteps}
            isCurrent={activeStep === 0}
          />
        )}
      </div>
      {activeStep > 0 && activeStep < MAX_STEPS && (
        <div className="flex items-start">
          <div className="flex gap-4 justify-center items-center h-10">
            {Array.from({ length: MAX_STEPS }).map((_, index) => {
              if (index === 0) return null;
              return (
                <ProgressPoint
                  key={index}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  index={index}
                  completedSteps={completedSteps}
                />
              );
            })}
          </div>
        </div>
      )}
    </CreationContainer>
  );
  return null;
}
