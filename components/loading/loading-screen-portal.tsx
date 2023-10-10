"use client";
import { createPortal } from "react-dom";
import LoadingScreen from "./loading-screen";

const LoadingScreenPortal = () => {
  return createPortal(<LoadingScreen />, window.document.body);
};

export default LoadingScreenPortal;
