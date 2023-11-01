import { EditorBackButton } from "@/components/editor/editor-back-button";
import PublishButton from "@/components/editor/publish-button";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import TestButton from "@/components/editor/test-button";
import { SettingGroups } from "@/lib/editor/editor-options";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Adventure Editor",
  description: "Editor for creating new adventures.",
};

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-96 w-full flex flex-col">
    <div className="flex justify-between flex-col p-4 gap-2 md:p-6 w-full">
      <div className="flex flex-row items-center">
        <EditorBackButton />
        EditorBackButton <h2>Adventure Editor</h2>
        <TestButton />
        <PublishButton />
      </div>
    </div>

    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12">
      <aside className="lg:w-1/5">
        <SidebarNav items={SettingGroups} />
      </aside>
      <div className="flex-1 lg:max-w-2xl">{children}</div>
    </div>
  </div>
);

export default AdventuresLayout;
