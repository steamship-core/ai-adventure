"use client";

import { EditorBackButton } from "@/components/editor/editor-back-button";
import PublishButton from "@/components/editor/publish-button";
import { PublishCTA } from "@/components/editor/publish-cta";
import TestButton from "@/components/editor/test-button";
import { useState } from "react";

const EditorActions = ({
  hasUnpublishedChanges,
  isGenerating = false,
  revalidate,
}: {
  hasUnpublishedChanges: boolean;
  isGenerating: boolean;
  revalidate: () => Promise<void>;
}) => {
  const [unpublishedChanges, setHasUnpublishedChanges] = useState(
    hasUnpublishedChanges
  );
  const onPublish = () => {
    setHasUnpublishedChanges(false);
    revalidate();
  };

  return (
    <>
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
    </>
  );
};

export default EditorActions;
