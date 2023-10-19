"use client";
import { createPortal } from "react-dom";
import LoadingScreen from "./loading-screen";

const LoadingScreenPortal = ({ text }: { text?: string }) => {
  return createPortal(<LoadingScreen text={text} />, window.document.body);
};

export default LoadingScreenPortal;
