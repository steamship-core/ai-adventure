"use client";
import { getGameState, updateGameState } from "@/lib/game/game-state.client";
import { GameState } from "@/lib/game/schema/game_state";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useState } from "react";
import useLoadingScreen from "../loading/use-loading-screen";
import { PlayTestBanner } from "../status-banners/play-test";
import { Input } from "../ui/input";
import { TypographyH1 } from "../ui/typography/TypographyH1";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import CharacterCreationComplete, {
  CharacterConfig,
} from "./complete-character";
import { CreationContainer } from "./shared/components";

export default function CharacterCreation({
  isDevelopment = false,
}: {
  isDevelopment: boolean;
}) {
  const searchParams = useSearchParams();
  const [configuration, setConfiguration] = useState<CharacterConfig>({
    player: {
      name: searchParams.get("name") || "",
      description: searchParams.get("description") || "",
      background: searchParams.get("background") || "",
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

  const { loadingScreen, setIsVisible } = useLoadingScreen(
    "Building your AI generated adventure. This may take a minute..."
  );
  const router = useRouter();

  const steps = [
    {
      placeholder: "A unique name",
      text: "Choose a name for your character.",
      buttonText: "Set name",
      title: "Name",
      minLength: 2,
      initialValue: configuration.player.name,
      setConfiguration: (name: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, name },
        });
      },
    },
    {
      placeholder: "A detailed description of your character's appearance",
      text: "Describe your character's appearance.",
      buttonText: "Set appearance",
      title: "Appearance",
      minLength: 10,
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
        "A description of your character's background, personality, and motivations",
      text: "Describe your character's background.",
      title: "Background",
      buttonText: "Set background",
      minLength: 10,
      initialValue: configuration.player.background,
      setConfiguration: (background: string) => {
        setConfiguration({
          ...configuration,
          player: { ...configuration.player, background },
        });
      },
    },
  ];

  const params = useParams<{ handle: string }>();

  const pollForAgentSideOnboardingComplete = async () => {
    // Call getGameState once every second until the game state is no longer onboarding
    // or an error occurs. Attempt this for 3 minutes.
    let count = 0;
    const interval = setInterval(async () => {
      count += 1;
      console.log(`polling for agent side onboarding complete count: ${count}`);
      const gameState = await getGameState(params.handle);
      let isError = false;
      if (count > 180) {
        clearInterval(interval);
        isError = gameState.active_mode !== "error" ? false : true;
      } else {
        isError = gameState.active_mode === "error";
      }
      if (isError) {
        const whatHappened = encodeURIComponent(
          "Your game has transitioned to an irrecoverable error state."
        );
        const whatYouCanDo = encodeURIComponent(
          "Try creating a new game. We're sorry this happened!"
        );
        const technicalDetails = encodeURIComponent(
          gameState?.unrecoverable_error || "Unknown"
        );
        router.push(
          `/error?whatHappened=${whatHappened}&whatYouCanDo=${whatYouCanDo}&technicalDetails=${technicalDetails}`
        );
      } else if (gameState.active_mode !== "onboarding") {
        clearInterval(interval);
        router.push(`/play/${params.handle}/camp`);
      }
    }, 2000);
  };

  const onComplete: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsVisible(true);
    try {
      await updateGameState(configuration as GameState, params.handle);
      const res = await fetch(
        `/api/agent/${params.handle}/completeOnboarding`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        let url = new URL(
          `${window.location.protocol}//${window.location.hostname}/error`
        );
        url.searchParams.append("technicalDetails", await res.text());
        url.searchParams.append(
          "whatHappened",
          "We were unable to complete your adventure onboarding."
        );
        router.push(url.toString());
      } else {
        pollForAgentSideOnboardingComplete();
      }
    } catch (e) {
      let url = new URL("/error");
      url.searchParams.append("technicalDetails", `Exception: ${e}`);
      url.searchParams.append(
        "whatHappened",
        "We were unable to complete your adventure onboarding: an exception was thrown while trying to complete onboarding."
      );
      router.push(url.toString());
    }
  };

  return (
    <CreationContainer>
      {loadingScreen}
      <div className="absolute top-0 left-0 w-full h-full -z-20 blur-2xl overflow-hidden">
        <div className="relative w-full h-full opacity-40">
          <div className="absolute top-[14rem] left-[12.5rem] h-44 w-44 bg-indigo-500 rounded-full " />
          <div className="absolute top-[19rem] left-[16.5rem] h-44 w-56 bg-indigo-600 rounded-full " />

          <div className="absolute bottom-32 right-10 h-44 w-44 bg-indigo-500 rounded-full " />
          <div className="absolute bottom-[12rem] right-[15rem] h-44 w-44 bg-indigo-600 rounded-full " />
          <div className="absolute bottom-32 right-20 h-12 w-72 bg-indigo-700 rounded-full" />
        </div>
      </div>
      {isDevelopment && <PlayTestBanner />}
      <div className="flex items-center justify-center flex-1 w-full">
        <form onSubmit={onComplete} className="w-full flex flex-col gap-4">
          <div className="text-center flex flex-col gap-2">
            <TypographyH1>Create your Character</TypographyH1>
            <TypographyMuted>
              Enter a few details about your character. The more descriptive the
              better!
            </TypographyMuted>
          </div>
          <div className="flex flex-col gap-8 w-full">
            {steps.map((stepConfig, index) => (
              <div key={stepConfig.title}>
                <Label>{stepConfig.title}</Label>
                <TypographyMuted>{stepConfig.text}</TypographyMuted>
                <Input
                  required
                  minLength={stepConfig.minLength}
                  type="text"
                  placeholder={stepConfig.placeholder}
                  value={stepConfig.initialValue}
                  onChange={(e) => {
                    stepConfig.setConfiguration(e.target.value);
                  }}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
          <CharacterCreationComplete config={configuration} />
        </form>
      </div>
    </CreationContainer>
  );
  return null;
}
