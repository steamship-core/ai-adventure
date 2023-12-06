"use client";
import OrbLoader from "./orb-loader";

const LoadingScreen = ({ text }: { text?: string }) => {
  return (
    <div className="fixed top-0 left-0 h-[100dvh] z-50 w-full bg-background flex flex-col">
      <OrbLoader text={text} />
    </div>
  );
};

export default LoadingScreen;
