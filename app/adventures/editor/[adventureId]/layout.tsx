import { ErrorSheet } from "@/components/error-sheet";
import RecoilProvider from "@/components/providers/recoil";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Adventure Editor",
  description: "Editor for creating new adventures.",
};

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <RecoilProvider>
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <TypographyH1>Adventure Editor</TypographyH1>
          <TypographyMuted className="text-lg">
            Create a custom adventure to share with your friends.
          </TypographyMuted>
        </div>
      </div>
      <>{children}</>
    </div>
    <ErrorSheet />
  </RecoilProvider>
);

export default AdventuresLayout;
