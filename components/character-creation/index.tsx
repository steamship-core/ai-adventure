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
import { CreationContainer } from "./components";
import CharacterCreationBackground from "./set-background";
import CharacterCreationComplete from "./complete-character";

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

export default function CharacterCreation() {
  const [activeStep, setActiveStep] = useState(0);
  const [showTheme, setShowTheme] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showFinalStep, setShowFinalStep] = useState(false);

  const [configuration, setConfiguration] = useState({
    name: "",
    theme: "",
    appearance: "",
    background: "",
  });

  return (
    <CreationContainer>
      <div className="flex flex-col gap-12">
        <CharacterCreationIntro
          onContinue={() => {
            setShowTheme(true);
            setActiveStep(1);
          }}
          isCurrent={activeStep === 0}
        />
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
        {showFinalStep && (
          <CharacterCreationComplete
            config={configuration}
            onFocus={() => setActiveStep(5)}
            isCurrent={activeStep === 5}
          />
        )}
      </div>
    </CreationContainer>
  );
  // if (state.value === "start") {
  //   return <CharacterCreationIntro onContinue={() => send("START_CREATION")} />;
  // }
  // if (state.value === "settingTheme") {
  //   return <CharacterCreationTheme onContinue={() => send("SET_THEME")} />;
  // }
  // if (state.value === "settingName") {
  //   return <CharacterCreationName onContinue={() => send("SET_NAME")} />;
  // }
  // if (state.value === "settingAppearance") {
  //   return (
  //     <CharacterCreationAppearance onContinue={() => send("SET_APPEARANCE")} />
  //   );
  // }
  return null;
}
