"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const LoadingScreenPortal = dynamic(() => import("./loading-screen-portal"), {
  ssr: false,
});

const useLoadingScreen = (text?: string) => {
  const [isVisible, setIsVisible] = useState(false);

  return {
    loadingScreen: isVisible ? <LoadingScreenPortal text={text} /> : null,
    setIsVisible,
  };
};

export default useLoadingScreen;
