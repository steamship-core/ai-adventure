import { ErrorSheet } from "@/components/error-sheet";
import RecoilProvider from "@/components/providers/recoil";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Adventure Editor",
  description: "Editor for creating new adventures.",
};

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <RecoilProvider>
    <div className="flex flex-grow flex-col gap-6 px-4 md:px-6">{children}</div>
    <ErrorSheet />
  </RecoilProvider>
);

export default AdventuresLayout;
