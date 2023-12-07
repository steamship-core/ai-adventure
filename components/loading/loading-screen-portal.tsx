"use client";
import { createPortal } from "react-dom";
import LoadingScreen from "./loading-screen";

const LoadingScreenPortal = ({
  text,
  title,
}: {
  text?: string;
  title?: string;
}) => {
  return createPortal(
    <LoadingScreen text={text} title={title} />,
    window.document.body
  );
};

export default LoadingScreenPortal;
