"use client";

import { useEffect, useState } from "react";

export const useTypeWriter = ({
  text,
  delay = 25,
}: {
  text: string;
  delay?: number;
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Typing logic goes here
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }

    if (currentIndex === text.length) {
      const timeout = setTimeout(() => {
        setIsFinished(true);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return { currentText, isFinished };
};
