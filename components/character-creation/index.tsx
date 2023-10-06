"use client";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import GAME_INFO from "@/lib/game-info";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import CharacterCreationIntro from "./intro";
import CharacterCreationTheme from "./set-theme";
import CharacterCreationName from "./set-name";
import CharacterCreationAppearance from "./set-appearance";
import { useState } from "react";
import { CreationContainer } from "./shared/components";
import CharacterCreationBackground from "./set-background";
import CharacterCreationComplete from "./complete-character";
import { useSearchParams } from "next/navigation";

export const characterCreationMachine = createMachine({
  id: "characterCreation",
  initial: "start",
  predictableActionArguments: true,
  states: {
    start: {
      on: {
        START_CREATION: "settingTheme",
      },
    },
    settingTheme: {
      on: {
        SET_THEME: "settingName",
      },
    },
    settingName: {
      on: {
        SET_NAME: "settingAppearance",
      },
    },
    settingAppearance: {
      on: {
        SET_APPEARANCE: "settingPersonality",
      },
    },
    settingPersonality: {
      on: {
        SET_PERSONALITY: "settingBackground",
      },
    },
    settingBackground: {
      on: {
        SET_BACKGROUND: "characterCreated",
      },
    },
    characterCreated: {
      type: "final",
    },
  },
});

export type CharacterConfig = {
  name: string;
  theme: string;
  background: string;
  appearance: string;
};

/*
// configurable
name
description
background
motivation
tone
theme

// configurable by game
inventory
mission_summaries
*/

export default function CharacterCreation() {
  const searchParams = useSearchParams();
  const isCompleteConfig =
    searchParams.has("theme") &&
    searchParams.has("name") &&
    searchParams.has("appearance") &&
    searchParams.has("background");

  const [activeStep, setActiveStep] = useState(isCompleteConfig ? 5 : 0);
  const [showTheme, setShowTheme] = useState(isCompleteConfig ? true : false);
  const [showName, setShowName] = useState(isCompleteConfig ? true : false);
  const [showAppearance, setShowAppearance] = useState(
    isCompleteConfig ? true : false
  );
  const [showBackground, setShowBackground] = useState(
    isCompleteConfig ? true : false
  );
  const [showFinalStep, setShowFinalStep] = useState(
    isCompleteConfig ? true : false
  );

  const [configuration, setConfiguration] = useState<CharacterConfig>({
    name: isCompleteConfig ? searchParams.get("name")! : "",
    theme: isCompleteConfig ? searchParams.get("theme")! : "",
    appearance: isCompleteConfig ? searchParams.get("appearance")! : "",
    background: isCompleteConfig ? searchParams.get("background")! : "",
  });

  return (
    <CreationContainer>
      {showFinalStep && (
        <CharacterCreationComplete
          config={configuration}
          onFocus={() => setActiveStep(5)}
          isCurrent={activeStep === 5}
        />
      )}
      {showBackground && (
        <CharacterCreationBackground
          onContinue={(background) => {
            setShowFinalStep(true);
            setActiveStep(5);
            setConfiguration({ ...configuration, background });
          }}
          onFocus={() => setActiveStep(4)}
          isCurrent={activeStep === 4}
        />
      )}
      {showAppearance && (
        <CharacterCreationAppearance
          onContinue={(appearance) => {
            setShowBackground(true);
            setActiveStep(4);
            setConfiguration({ ...configuration, appearance });
          }}
          onFocus={() => setActiveStep(3)}
          isCurrent={activeStep === 3}
        />
      )}
      {showName && (
        <CharacterCreationName
          onContinue={(name) => {
            setShowAppearance(true);
            setActiveStep(3);
            setConfiguration({ ...configuration, name });
          }}
          onFocus={() => setActiveStep(2)}
          isCurrent={activeStep === 2}
        />
      )}
      {showTheme && (
        <CharacterCreationTheme
          onContinue={(theme) => {
            setShowName(true);
            console.log("continue");
            setActiveStep(2);
            setConfiguration({ ...configuration, theme });
          }}
          onFocus={() => {
            console.log("focus");
            setActiveStep(1);
          }}
          isCurrent={activeStep === 1}
        />
      )}
      <CharacterCreationIntro
        onContinue={() => {
          setShowTheme(true);
          setActiveStep(1);
        }}
        isCurrent={activeStep === 0}
      />
    </CreationContainer>
  );
  return null;
}
