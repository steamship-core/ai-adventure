"use client";

import { EditorBackButton } from "@/components/editor/editor-back-button";
import PublishButton from "@/components/editor/publish-button";
import { PublishCTA } from "@/components/editor/publish-cta";
import { SidebarNav } from "@/components/editor/sidebar-nav";
import TestButton from "@/components/editor/test-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingGroup } from "@/lib/editor/DEPRECATED-editor-options";
import { Adventure } from "@prisma/client";
import { PlayIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CharacterTemplatesSection from "../adventures/character-templates-section";
import { CustomTooltip } from "../camp/welcome-modal";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import GeneratingView from "./generating-view";
import SettingGroupForm from "./setting-group-form";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });
// @ts-ignore
const joyrideSteps: StepProps = [
  {
    target: "#publish-section",
    placement: "bottom",
    title: "Test & Publsh",
    content: (
      <>
        <TypographyMuted className="text-base text-muted-foreground">
          Click <b> Test</b> to demo your adventure before publishing changes.
          You can then <b>Publish</b> your changes and make them live. After
          publishing, you can share your adventure with friends!
        </TypographyMuted>
      </>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#editor-side-nav",
    placement: "right-start",
    title: "Editor Navigation",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Adventures are highly customizable. Use the navigation on the left to
        edit all aspects of your adventure. As a good next step, check out the{" "}
        <b>Story</b> and <b>Character</b> tabs.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#description",
    placement: "top",
    title: "Auto Generated Description",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Based on your adventure settings, we&apos;ve generated a description for
        your adventure. You can edit this description, or write your own.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#image",
    placement: "top",
    title: "Auto Generated Image",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        We also generated an image for your adventure. You can edit this image,
        or upload your own.
      </TypographyMuted>
    ),
    disableBeacon: true,
  },

  {
    target: "body",
    placement: "center",
    title: "Start Building!",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Congrats! You can either continue exploring the editor, or return to the
        adventure page and start playing.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
];

const Editor = ({
  adventure,
  adventureId,
  devConfig,
  hasUnpublishedChanges,
  isUserApproved,
  isGenerating = false,
  isGeneratingTaskId = null,
  stateUpdatedAt = null,
  settingGroups = [],
}: {
  adventure: Adventure;
  adventureId: string;
  devConfig: any;
  hasUnpublishedChanges: boolean;
  isUserApproved: boolean;
  isGenerating: boolean;
  isGeneratingTaskId?: string | null;
  stateUpdatedAt?: Date | null;
  settingGroups: SettingGroup[];
}) => {
  const [activeConfig, setDevConfig] = useState(devConfig);
  const [unpublishedChanges, setHasUnpublishedChanges] = useState(
    hasUnpublishedChanges
  );
  const [unsavedChangesExist, setUnsavedChangesExist] = useState(false);
  const [unsavedDepartureUrl, setUnsavedDepartureUrl] = useState<
    string | undefined
  >(undefined);

  const onPublish = () => {
    setHasUnpublishedChanges(false);
  };

  const onDataChange = (key: string, value: any) => {
    setUnsavedChangesExist(true);
  };

  const displayUnsavedChangesModal = (destination: string) => {
    setUnsavedDepartureUrl(destination);
  };

  const [showTutorial, setShowTutorial] = useState(false);
  const queryParams = useSearchParams();
  const initializationSuccess = queryParams.get("initializationSuccess");

  useEffect(() => {
    // get if the yser has seen the tutorial from local storage
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    // if the user has not seen the tutorial, show it
    if (!hasSeenTutorial && initializationSuccess) {
      setShowTutorial(true);
    }
  }, []);

  const onComplete = () => {
    localStorage.setItem("hasSeenTutorial", "true");
  };

  return (
    <>
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
      <div className="flex flex-row space-x-2" id="publish-section">
        <EditorBackButton />
        {!isGenerating && (
          <>
            <TestButton className="mr-2" />
            {unpublishedChanges && (
              <PublishButton className="mr-2" onPublish={onPublish} />
            )}
          </>
        )}
      </div>
      {unpublishedChanges && (
        <div className="flex flex-row space-x-2">
          <PublishCTA />
        </div>
      )}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
        <aside className="col-span-3 lg:col-span-2" id="editor-side-nav">
          <SidebarNav
            items={settingGroups}
            unsavedChangesExist={unsavedChangesExist}
            displayUnsavedChangesModal={displayUnsavedChangesModal}
          />
        </aside>
        <div className="col-span-9 lg:col-span-10">
          {!isGenerating && (
            <SettingGroupForm
              existing={activeConfig}
              onDataChange={onDataChange}
              isUserApproved={isUserApproved}
              settingGroups={settingGroups}
            />
          )}
          {isGenerating && (
            <GeneratingView
              adventureId={adventureId}
              isGeneratingTaskId={isGeneratingTaskId}
              stateUpdatedAt={stateUpdatedAt}
            />
          )}
        </div>
      </div>
      {unsavedDepartureUrl}
      <Dialog open={typeof unsavedDepartureUrl != "undefined"}>
        <DialogContent showClose={false}>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to navigate away before saving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {unsavedDepartureUrl && (
              <Link href={unsavedDepartureUrl!}>
                <Button>Yes</Button>
              </Link>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setUnsavedDepartureUrl(undefined);
              }}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Joyride
        run={showTutorial}
        // @ts-ignore
        steps={joyrideSteps}
        continuous
        showProgress
        hideCloseButton
        tooltipComponent={CustomTooltip}
        disableOverlayClose
        disableCloseOnEsc
        styles={{
          // @ts-ignore
          options: {
            arrowColor: "hsl(var(--foreground))",
          },
        }}
        callback={(data: any) => {
          if (
            data.lifecycle === "complete" &&
            data.index === 2 &&
            data.action === "next"
          ) {
            onComplete();
          }
        }}
      />
    </>
  );
};

export default Editor;
