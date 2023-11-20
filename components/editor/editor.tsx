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
import { SettingGroup } from "@/lib/editor/editor-options";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilEditorLayoutImage } from "../providers/recoil";
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

  const [isLoading, setIsLoading] = useState(true);
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>([]);
  const [, setEditorLayoutImage] = useRecoilState(recoilEditorLayoutImage);

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

  setEditorLayoutImage(devConfig.adventure_image);

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
          {!isLoading && (
            <SidebarNav
              items={settingGroups}
              unsavedChangesExist={unsavedChangesExist}
              displayUnsavedChangesModal={displayUnsavedChangesModal}
            />
          )}
        </aside>
        <div className="col-span-9 lg:col-span-10">
          {!isLoading && (
            <SettingGroupForm
              existing={activeConfig}
              onDataChange={onDataChange}
              isUserApproved={isUserApproved}
              settingGroups={settingGroups}
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
