import CharacterTemplatesSection from "@/components/adventures/character-templates-section";
import EditorActions from "@/components/editor/layout/actions";
import EditorTutorial from "@/components/editor/layout/tutorial";
import EditorUnsavedChangesModal from "@/components/editor/layout/unsaved-changes-modal";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import { ErrorSheet } from "@/components/error-sheet";
import RecoilProvider from "@/components/providers/recoil";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { getSchema } from "@/lib/agent/agent.server";
import {
  DEPRECATEDSettingGroups,
  SettingGroup,
} from "@/lib/editor/DEPRECATED-editor-options";
import { objectEquals } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { PlayIcon } from "lucide-react";
import { log } from "next-axiom";
import { ReactNode } from "react";

export default async function EditorLayout({
  params,
  children,
}: {
  params: { adventureId: string };
  children: ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(params.adventureId, true);
  if (!adventure) {
    log.error("No adventure");
    throw new Error("no adventure");
  }

  let unpublishedChanges = !objectEquals(
    adventure.agentDevConfig || {},
    adventure.agentConfig || {}
  );
  const hasUnpublishedChanges = unpublishedChanges;
  const isGenerating = adventure?.state == "generating";
  const agentVersionParts = adventure.agentVersion.split("@");
  const agentVersion = agentVersionParts.length > 1 ? agentVersionParts[1] : "";

  let settingGroups: SettingGroup[] = [];
  if (agentVersion?.startsWith("1.")) {
    settingGroups = DEPRECATEDSettingGroups;
  } else {
    const responseJson = await getSchema(adventure.devAgent?.agentUrl!);
    settingGroups = responseJson.settingGroups;
  }

  return (
    <RecoilProvider>
      <div className="flex flex-grow flex-col gap-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between mt-4">
          <div>
            <TypographyH1>Adventure Editor</TypographyH1>
            <TypographyMuted className="text-lg">
              Create a custom adventure to share with your friends.
            </TypographyMuted>
          </div>
        </div>
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="text-white bg-indigo-500 hover:bg-indigo-700 p-4 text-lg flex gap-2">
                <PlayIcon />
                Start adventure
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <CharacterTemplatesSection adventure={adventure} />
            </SheetContent>
          </Sheet>
        </div>
        <EditorActions
          hasUnpublishedChanges={hasUnpublishedChanges}
          isGenerating={isGenerating}
        />
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
          <aside className="col-span-3 lg:col-span-2" id="editor-side-nav">
            <SidebarNav items={settingGroups} />
          </aside>
          <div className="col-span-9 lg:col-span-10">{children}</div>
        </div>
        <EditorUnsavedChangesModal />
        <EditorTutorial />
      </div>
      <ErrorSheet />
    </RecoilProvider>
  );
}
