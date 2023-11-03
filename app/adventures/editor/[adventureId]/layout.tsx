import { EditorBackButton } from "@/components/editor/editor-back-button";
import LayoutImage from "@/components/editor/layout-image";
import PublishButton from "@/components/editor/publish-button";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import TestButton from "@/components/editor/test-button";
import RecoilProvider from "@/components/providers/recoil";
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
  <RecoilProvider>
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <TypographyH1>Adventure Editor</TypographyH1>
          <TypographyMuted className="text-lg">
            Create a custom adventure to share with your friends.
          </TypographyMuted>
        </div>
        <LayoutImage />
      </div>
      <div className="flex flex-row space-x-2">
        <EditorBackButton />
        <TestButton className="mr-2" />
        <PublishButton className="mr-2" />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
        <aside className="col-span-3 lg:col-span-2">
          <SidebarNav items={SettingGroups} />
        </aside>
        <div className="col-span-9 lg:col-span-10">{children}</div>
      </div>
    </div>
  </RecoilProvider>
);

export default AdventuresLayout;
