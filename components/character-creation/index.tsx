"use client";
import CharacterCreationIntro from "./intro";
import CharacterCreationGenre from "./set-genre";
import CharacterCreationName from "./set-name";
import CharacterCreationAppearance from "./set-appearance";
import { useState } from "react";
import { CreationContainer } from "./shared/components";
import CharacterCreationBackground from "./set-background";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import { useSearchParams } from "next/navigation";
import CharacterCreationTone from "./set-tone";

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
      chat_file_id: null,
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
        <CharacterCreationBackground
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
        />
      )}
      {step > 3 && (
        <CharacterCreationAppearance
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
        />
      )}
      {step > 2 && (
        <CharacterCreationName
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
        />
      )}
      {step > 1 && (
        <CharacterCreationTone
          onContinue={(tone) => {
            setStep(3);
            setActiveStep(3);
            setConfiguration({ ...configuration, tone });
          }}
          onFocus={() => {
            setActiveStep(2);
          }}
          isCurrent={activeStep === 2}
        />
      )}
      {step > 0 && (
        <CharacterCreationGenre
          onContinue={(genre) => {
            setStep(2);
            setActiveStep(2);
            setConfiguration({ ...configuration, genre });
          }}
          onFocus={() => {
            setActiveStep(1);
          }}
          isCurrent={activeStep === 1}
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
