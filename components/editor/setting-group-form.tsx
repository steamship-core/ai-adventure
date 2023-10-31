"use client";

import { SettingGroups } from "@/lib/editor/editor-options";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import SettingElement from "./setting-element";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm({
  existing,
}: {
  existing: Record<string, any>;
}) {
  const { groupName, adventureId } = useEditorRouting();
  const [bgFile, setBgFile] = useState<File | null>(null);
  const { mutate, isPending, submittedAt, isSuccess } = useMutation({
    mutationFn: async (data: any) => {
      if (bgFile) {
        await fetch(
          `/api/adventure/${adventureId}/image?filename=${bgFile.name}`,
          {
            method: "POST",
            body: bgFile,
          }
        );
      }
      return fetch("/api/editor", {
        method: "POST",
        body: JSON.stringify({
          operation: "update",
          id: adventureId,
          data,
        }),
      });
    },
  });

  const sg = SettingGroups.filter((group) => groupName === group.href)[0];

  /*
   * Change Capture
   *
   * We set this upon any change to the form elements, and then the server/agent side only updates
   * those fields which were changed.
   */
  const [dataToUpdate, setDataToUpdate] = useState<Record<string, any>>({});

  const onSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    mutate(dataToUpdate);
  };

  const setKeyValue = (key: string, value: any) => {
    setDataToUpdate((prior) => {
      console.log(`set(${key}, ${value})`);
      return { ...prior, [key]: value };
    });
  };

  if (!sg) {
    return <div>Error: unable to find setting group {groupName} </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{sg.title}</h3>
        <p className="text-sm text-muted-foreground">{sg.description}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {sg.settings?.map((setting) => (
          <SettingElement
            key={setting.name}
            setting={setting}
            updateFn={setKeyValue}
            setBgFile={setBgFile}
            valueAtLoad={existing ? existing[setting.name] : null}
          />
        ))}
        <Button type="submit" value="Save" onClick={onSubmit}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
      {submittedAt && isSuccess ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <CheckIcon size={14} />
          Adventure Updated
        </div>
      ) : null}

      {/* todo 
      <Separator />
      <NotificationsForm />
      */}
    </div>
  );
}
