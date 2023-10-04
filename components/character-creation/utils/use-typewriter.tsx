"use client";

import { useEffect, useState } from "react";

export const useTypeWriter = ({
  text,
  delay = 25,
}: {
  text: string;
  delay?: number;
}) => {
  // HACK: For most browsers we could just grow the string,
  // but for ios devices we need to mask the text. This is so
  // the device can compute the correct height of the text. Without
  // this, the text height will be incorrectly computed and will
  // overflow into the buttons below. Scroll behavior also behaves oddly.
  const [maskedText, setMaskedText] = useState(
    <span className="opacity-0">{text}</span>
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Typing logic goes here
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
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

  useEffect(() => {
    const maskedText = (
      <>
        {text.substring(0, currentIndex)}
        <span className="opacity-0">{text.substring(currentIndex)}</span>
      </>
    );
    setMaskedText(maskedText);
  }, [currentIndex, text]);

  return { currentText: maskedText, isFinished };
};
