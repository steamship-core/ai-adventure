import PublishButton from "@/components/editor/publish-button";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import TestButton from "@/components/editor/test-button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { SettingGroups } from "@/lib/editor/editor-options";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Adventure Editor",
  description: "Editor for creating new adventures.",
};

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
    <TypographyH1>AI Adventures Editor</TypographyH1>
    <TypographyMuted className="text-lg">
      Create a completely custom adventure to share with your friends.
    </TypographyMuted>
    <div className="flex flex-row">
      <TestButton className="mr-2" />
      <PublishButton className="mr-2" />
    </div>
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="lg:w-1/5">
        <SidebarNav items={SettingGroups} />
      </aside>
      <div className="flex-1 lg:max-w-2xl">{children}</div>
    </div>
  </div>
);

export default AdventuresLayout;
