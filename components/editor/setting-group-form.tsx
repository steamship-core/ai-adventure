"use client";

import { SettingGroups } from "@/lib/editor/editor-options";
import { useEditorRouting } from "@/lib/editor/use-editor";
import Editor from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { PutBlobResult } from "@vercel/blob";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { parse, stringify } from "yaml";
import { recoilEditorLayoutImage } from "../providers/recoil";
import { Button } from "../ui/button";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import SettingElement from "./setting-element";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm({
  existing,
}: {
  existing: Record<string, any>;
}) {
  const existingThemesFromConfig = (_config: any) => {
    const _existingThemes = (_config as any)?.themes || [];
    const _existingDynamicThemes = _existingThemes.map((theme: any) => {
      return {
        label: theme.name,
        value: theme.name,
      };
    });
    return _existingDynamicThemes;
  };

  const { groupName, adventureId } = useEditorRouting();
  const [, setEditorLayoutImage] = useRecoilState(recoilEditorLayoutImage);
  const { toast } = useToast();

  const [existingThemes, setExistingThemes] = useState<
    { value: string; label: string }[]
  >(existingThemesFromConfig(existing));

  const { mutate, isPending, submittedAt, isSuccess } = useMutation({
    mutationKey: ["update-adventure", adventureId],
    mutationFn: async (data: any) => {
      const dataToSave = data;
      if (data.adventure_image) {
        const res = await fetch(
          `/api/adventure/${adventureId}/image?filename=${data.adventure_image.name}`,
          {
            method: "POST",
            body: data.adventure_image,
          }
        );
        if (res.ok) {
          const blobJson = (await res.json()) as PutBlobResult;
          setEditorLayoutImage(blobJson.url);
          dataToSave.adventure_image = blobJson.url;
        }
      }

      const characters = data.characters || [];
      for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        if (character.image) {
          const res = await fetch(
            `/api/adventure/${adventureId}/image?filename=${character.image.name}`,
            {
              method: "POST",
              body: character.image,
            }
          );
          if (res.ok) {
            const blobJson = (await res.json()) as PutBlobResult;
            characters[i].image = blobJson.url;
          }
        }
      }
      console.log("dataToSave", dataToSave);

      if (typeof dataToSave.themes != "undefined") {
        setExistingThemes(existingThemesFromConfig(dataToSave));
      }

      let res = await fetch("/api/editor", {
        method: "POST",
        body: JSON.stringify({
          operation: "update",
          id: adventureId,
          data: dataToSave,
        }),
      });

      window?.scrollTo(0, 0);

      return res;
    },
  });

  useEffect(() => {
    if (existing?.image) {
      setEditorLayoutImage(existing.image);
    }
  }, []);

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
        const { dismiss } = toast({
          title: "Imported",
        });
        setTimeout(() => {
          dismiss();
        }, 2000);
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onSave = (e: any) => {
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

  let yaml = "";
  if (sg.href == "export") {
    yaml = stringify(existing);
  }

  // The editor has special knowledge of the image themes so that it can display a dropdown

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{sg.title}</h3>
        <p className="text-sm text-muted-foreground">{sg.description}</p>
      </div>

      {sg.href == "import" ? (
        <form onSubmit={onImport} className="space-y-8">
          <Editor
            language="yaml"
            theme="vs-dark"
            height="400px"
            width="100%"
            value={importYaml}
            options={{
              minimap: {
                enabled: false,
              },
            }}
            onChange={(newVal?: string) => {
              setImportYaml(newVal || "");
            }}
          />
          <Button type="submit" value="Save" onClick={onImport}>
            Save
          </Button>
        </form>
      ) : sg.href == "export" ? (
        <div className="space-y-8">
          <Editor
            language="yaml"
            theme="vs-dark"
            height="400px"
            width="100%"
            options={{
              readOnly: true,
              minimap: {
                enabled: false,
              },
            }}
            value={yaml}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {sg.settings?.map((setting) => (
            <SettingElement
              key={setting.name}
              setting={setting}
              updateFn={setKeyValue}
              valueAtLoad={existing ? existing[setting.name] : null}
              existingDynamicThemes={existingThemes}
            />
          ))}
          <Button value="Save" onClick={onSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          {submittedAt && isSuccess ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckIcon size={14} />
              Adventure Updated
            </div>
          ) : null}
        </div>
      )}

      <Toaster />
    </div>
  );
}
