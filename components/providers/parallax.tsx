"use client";
import { ReactNode } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export const ClientParallaxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <ParallaxProvider>{children}</ParallaxProvider>;
};
