import PublishButton from "@/components/editor/publish-button";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import { Button } from "@/components/ui/button";
import { SettingGroups } from "@/lib/editor/editor-options";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Adventure Editor",
  description: "Editor for creating new adventures.",
};

const AdventuresLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative h-full p-4">
    <div className="md:hidden"></div>
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Adventure Editor</h2>
        <p className="text-muted-foreground">
          Create a completely custom adventure to share with your friends.
        </p>
        <div className="flex flex-row">
          <Button className="mr-2">Play Test</Button>
          <PublishButton className="mr-2" />
        </div>
      </div>
      {/* <Separator className="my-6" /> */}
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={SettingGroups} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  </div>
);

export default AdventuresLayout;
