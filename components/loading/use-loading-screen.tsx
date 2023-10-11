"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const LoadingScreenPortal = dynamic(() => import("./loading-screen-portal"), {
  ssr: false,
});

const useLoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  return {
    loadingScreen: isVisible ? <LoadingScreenPortal /> : null,
    setIsVisible,
  };
};

export default useLoadingScreen;
