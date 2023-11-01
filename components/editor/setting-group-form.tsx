"use client";

import { SettingGroups } from "@/lib/editor/editor-options";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { useState } from "react";
import { parse, stringify } from "yaml";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SettingElement from "./setting-element";
// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm({
  existing,
}: {
  existing: Record<string, any>;
}) {
  const { groupName, adventureId } = useEditorRouting();

  const sg = SettingGroups.filter((group) => groupName === group.href)[0];

  /*
   * Change Capture
   *
   * We set this upon any change to the form elements, and then the server/agent side only updates
   * those fields which were changed.
   */
  const [dataToUpdate, setDataToUpdate] = useState<Record<string, any>>({});
  const [importYaml, setImportYaml] = useState("");

  const onImport = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let data = {};
    try {
      data = parse(importYaml);
    } catch (e) {
      console.log(e);
      alert(e);
      return;
    }

    fetch("/api/editor", {
      method: "POST",
      body: JSON.stringify({
        operation: "import",
        id: adventureId,
        data,
      }),
    }).then(
      (res) => {
        alert("Imported!");
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onSave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/editor", {
      method: "POST",
      body: JSON.stringify({
        operation: "update",
        id: adventureId,
        data: dataToUpdate,
      }),
    }).then(
      (res) => {
        alert("Saved!");
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

  let yaml = "";
  if (sg.href == "export") {
    yaml = stringify(existing);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{sg.title}</h3>
        <p className="text-sm text-muted-foreground">{sg.description}</p>
      </div>

      {sg.href == "import" ? (
        <form onSubmit={onImport} className="space-y-8">
          <Textarea
            onChange={(e) => {
              setImportYaml(e.target.value);
            }}
            rows={10}
            className="min-h-48"
            value={importYaml}
          />
          <Button type="submit" value="Save" onClick={onImport}>
            Save
          </Button>
        </form>
      ) : sg.href == "export" ? (
        <div className="space-y-8">
          <code className="text-sm">
            <pre>{yaml}</pre>
          </code>
        </div>
      ) : (
        <div className="space-y-8">
          {sg.settings?.map((setting) => (
            <SettingElement
              key={setting.name}
              setting={setting}
              updateFn={setKeyValue}
              valueAtLoad={existing ? existing[setting.name] : null}
            />
          ))}
          <Button type="submit" value="Save" onClick={onSave}>
            Save
          </Button>
        </div>
      )}

      {/* todo 
      <Separator />
      <NotificationsForm />
      */}
    </div>
  );
}
