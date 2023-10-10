"use client";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const LoadingScreen = () => {
  const funnyLoadingMessages = [
    "Rolling the dice...",
    "Training the goblins...",
    "Stoking the dungeon fires...",
    "Calibrating the catapults...",
    "Charging the crystal balls...",
    "Upgrading the goblins to version 2.0...",
    "Rebooting the matrix...",
    "Hiring more elves for faster loading...",
    "Consulting the oracle for optimal performance...",
    "Making sure the zombies are still in their cages...",
    "Asking the wizards for Wi-Fi passwords...",
    "Teaching dragons about fire safety...",
    "Bribing the game characters...",
    "Asking the old wise turtle for advice...",
    "Mixing potions and circuit boards...",
    "Blending the old scrolls with new code...",
    "Dialing up the interdimensional modem...",
    "Reminding the AI that it's loved (in a totally platonic, digital way)...",
    "Bribing goblins with shiny objects for better performance...",
    "Balrog's taking the elevator. Please wait...",
  ];

  const pickRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * funnyLoadingMessages.length);
    return funnyLoadingMessages[randomIndex];
  };

  const [loadingMessage, setLoadingMessage] = useState(pickRandomMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage(pickRandomMessage());
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-background flex items-center justify-center flex-col">
      <Player
        autoplay
        loop
        src="/fire-lottie.json"
        style={{ height: "600px", width: "600px" }}
      />

      {loadingMessage}
    </div>
  );
};

export default LoadingScreen;
