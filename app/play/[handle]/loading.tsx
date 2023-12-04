"use client";
import { Progress } from "@/components/ui/progress";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useState } from "react";

const PlayLoading = () => {
  const [progress, setProgress] = useState(0);

  const calculateSpeed = (currentProgress: number) => {
    if (currentProgress < 30) {
      return { increment: 0.5, interval: 200 }; // Start slow
    } else if (currentProgress < 60) {
      return { increment: 1, interval: 100 }; // Speed up
    } else if (currentProgress < 95) {
      return { increment: 0.3, interval: 150 }; // Slow down
    } else {
      return { increment: 5, interval: 50 }; // Finish quickly if API call is complete
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateProgress = () => {
      setProgress((oldProgress) => {
        if (oldProgress >= 95) {
          clearInterval(interval);
          return oldProgress;
        }

        // As the progress increases, the increment interval becomes longer
        const { increment, interval: newInterval } =
          calculateSpeed(oldProgress);
        const newProgress = oldProgress + increment;
        clearInterval(interval);
        interval = setInterval(updateProgress, newInterval);

        return newProgress;
      });
    };

    interval = setInterval(updateProgress, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-full w-full flex  px-12 max-w-xl mx-auto flex-col gap-4 items-center justify-center">
      <div className=" w-full">
        <Player autoplay loop src="/ai-orb.json" className="w-72" />
        <Progress value={progress} className="h-3" />
        <TypographyMuted>Loading... {Math.round(progress)}%</TypographyMuted>
      </div>
    </div>
  );
};

export default PlayLoading;
