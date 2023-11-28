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
import { useEditorRouting } from "@/lib/editor/use-editor";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import GeneratingView from "./generating-view";
import SettingGroupForm from "./setting-group-form";

const Editor = ({
  adventureId,
  devConfig,
  hasUnpublishedChanges,
  isUserApproved,
  isGenerating = false,
  isGeneratingTaskId = null,
  stateUpdatedAt = null,
}: {
  adventureId: string;
  devConfig: any;
  hasUnpublishedChanges: boolean;
  isUserApproved: boolean;
  isGenerating: boolean;
  isGeneratingTaskId?: string | null;
  stateUpdatedAt?: Date | null;
}) => {
  const [activeConfig, setDevConfig] = useState(devConfig);
  const [unpublishedChanges, setHasUnpublishedChanges] = useState(
    hasUnpublishedChanges
  );
  const [unsavedChangesExist, setUnsavedChangesExist] = useState(false);
  const [unsavedDepartureUrl, setUnsavedDepartureUrl] = useState<
    string | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>([]);
  const { groupName } = useEditorRouting();

  useEffect(() => {
    fetch(`/api/adventure/${adventureId}/schema`).then(
      async (res) => {
        const json = await res.json();
        setIsLoading(false);
        setSettingGroups(json.settingGroups);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  const onPublish = () => {
    setHasUnpublishedChanges(false);
  };

  const onDataChange = (key: string, value: any) => {
    setUnsavedChangesExist(true);
  };

  const displayUnsavedChangesModal = (destination: string) => {
    setUnsavedDepartureUrl(destination);
  };

  return (
    <>
      <div className="flex flex-row space-x-2">
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
        <aside className="col-span-3 lg:col-span-2">
          {!isLoading && (
            <SidebarNav
              items={settingGroups}
              unsavedChangesExist={unsavedChangesExist}
              displayUnsavedChangesModal={displayUnsavedChangesModal}
            />
          )}
        </aside>
        <div className="col-span-9 lg:col-span-10">
          {!isLoading && !isGenerating && (
            <SettingGroupForm
              existing={activeConfig}
              onDataChange={onDataChange}
              isUserApproved={isUserApproved}
              settingGroups={settingGroups}
            />
          )}
          {!isLoading && isGenerating && (
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
    </>
  );
};

export default Editor;
