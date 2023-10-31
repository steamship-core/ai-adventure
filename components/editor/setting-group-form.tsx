"use client";

import { SettingGroups } from "@/lib/editor/editor-options";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import SettingElement from "./setting-element";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm({
  existing,
}: {
  existing: Record<string, any>;
}) {
  /*
   * Routing
   */
  let pathname = usePathname();

  const parts = pathname?.split("/");
  let groupName = `general-settings`;
  let adventureId = "";
  if (parts && parts.length > 3) {
    groupName = parts[3];
    adventureId = parts[2];
  } else if (parts && parts.length > 2) {
    adventureId = parts[2];
  }

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
    console.log("[TODO] Save Setting");
    console.log(dataToUpdate);
    fetch("/api/editor", {
      method: "POST",
      body: JSON.stringify({
        operation: "update",
        id: adventureId,
        data: dataToUpdate,
      }),
    }).then(
      (res) => {
        console.log("TODO: UI Notify save success!");
      },
      (error) => {
        console.log(error);
      }
    );
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
            valueAtLoad={existing ? existing[setting.name] : null}
          />
        ))}
        <Button type="submit" value="Save" onClick={onSubmit}>
          Save
        </Button>
      </form>

      {/* todo 
      <Separator />
      <NotificationsForm />
      */}
    </div>
  );
}
