"use client";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PlayTestBanner } from "../status-banners/play-test";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import CharacterCreationIntro from "./intro";
import OnboardingPrompt from "./onboarding-prompt";
import { CreationContainer } from "./shared/components";

const MAX_STEPS = 4;

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

export default function CharacterCreation({
  isDevelopment = false,
}: {
  isDevelopment: boolean;
}) {
  const searchParams = useSearchParams();
  const [isCompleteConfig, setIsCompleteConfig] = useState(
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
      gold: 0,
      inventory: [],
    },
    camp: {
      human_players: [],
      npcs: [],
      name: "Camp",
    },
    quests: [],
  });

  const steps = [
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
      text: "Describe your character's appearance.",
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
      text: "Describe your character's background. Where did they come from? What is their backstory?",
      buttonText: "Set background",
      initialValue: configuration.player.background,
      setConfiguration: (background: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, background },
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
      {isDevelopment && <PlayTestBanner />}
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
