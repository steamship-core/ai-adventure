"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const LoadingScreenPortal = dynamic(() => import("./loading-screen-portal"), {
  ssr: false,
});

const useLoadingScreen = (text?: string, title?: string) => {
  const [isVisible, setIsVisible] = useState(false);

  return {
    loadingScreen: isVisible ? (
      <LoadingScreenPortal text={text} title={title} />
    ) : null,
    setIsVisible,
  };
};

export default useLoadingScreen;
