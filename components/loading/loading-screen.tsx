"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LoadingScreen = () => {
  const funnyLoadingMessages = [
    "Cleaning up the mess at camp ...",
    "Sharpening swords ...",
    "Polishing armor ...",
    "Preparing the horses ...",
    "Consulting the AI oracles ...",
    "Reading the stars ...",
    "Reading the tea leaves ...",
    "Conjuring the AI spirits ...",
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

  return createPortal(
    <div className="fixed top-0 left-0 h-full w-full bg-[rgb(14,18,23)] flex items-center justify-center flex-col">
      <div className="h-44 w-44">
        <Image src="/cfire.gif" width={640} height={640} alt="fire" />
      </div>
      {loadingMessage}
    </div>,
    window.document.body
  );
};

export default LoadingScreen;
