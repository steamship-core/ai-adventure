"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const LoadingScreen = dynamic(() => import("./loading-screen-portal"), {
  ssr: false,
});

const useLoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  return {
    loadingScreen: isVisible ? <LoadingScreen /> : null,
    setIsVisible,
  };
};

export default useLoadingScreen;
