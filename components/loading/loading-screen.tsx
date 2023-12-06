"use client";
import OrbLoader from "./orb-loader";

const LoadingScreen = ({ text, title }: { text?: string; title?: string }) => {
  return (
    <div className="fixed top-0 left-0 h-[100dvh] z-50 w-full bg-background flex flex-col">
      <OrbLoader title={title} text={text} />
    </div>
  );
};

export default LoadingScreen;
