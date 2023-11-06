"use client";

import { EditorBackButton } from "@/components/editor/editor-back-button";
import PublishButton from "@/components/editor/publish-button";
import { PublishCTA } from "@/components/editor/publish-cta";
import SettingGroupForm from "@/components/editor/setting-group-form";
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
import { SettingGroups } from "@/lib/editor/editor-options";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

const Editor = ({
  adventureId,
  devConfig,
  hasUnpublishedChanges,
  isUserApproved,
}: {
  adventureId: string;
  devConfig: any;
  hasUnpublishedChanges: boolean;
  isUserApproved: boolean;
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

  return (
    <>
      <div className="flex flex-row space-x-2">
        <EditorBackButton />
        <TestButton className="mr-2" />
        {unpublishedChanges && (
          <PublishButton className="mr-2" onPublish={onPublish} />
        )}
      </div>
      {unpublishedChanges && (
        <div className="flex flex-row space-x-2">
          <PublishCTA />
        </div>
      )}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
        <aside className="col-span-3 lg:col-span-2">
          <SidebarNav
            items={SettingGroups}
            unsavedChangesExist={unsavedChangesExist}
            displayUnsavedChangesModal={displayUnsavedChangesModal}
          />
        </aside>
        <div className="col-span-9 lg:col-span-10">
          <SettingGroupForm
            existing={activeConfig}
            onDataChange={onDataChange}
            isUserApproved={isUserApproved}
          />
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
