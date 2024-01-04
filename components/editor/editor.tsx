"use client";

import { SettingGroup } from "@/lib/editor/editor-types";
import GeneratingView from "./generating-view";
import SettingGroupForm from "./setting-group-form";

const Editor = ({
  adventureId,
  devConfig,
  isUserApproved,
  isGenerating = false,
  isGeneratingTaskId = null,
  stateUpdatedAt = null,
  settingGroups = [],
}: {
  adventureId: string;
  devConfig: any;
  isUserApproved: boolean;
  isGenerating: boolean;
  isGeneratingTaskId?: string | null;
  stateUpdatedAt?: Date | null;
  settingGroups: SettingGroup[];
}) => {
  return (
    <>
      {!isGenerating && (
        <SettingGroupForm
          existing={devConfig}
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
    </>
  );
};

export default Editor;
