"use client";

import { SettingGroup } from "@/lib/editor/editor-options";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { Block } from "@/lib/streaming-client/src";
import Editor from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { PutBlobResult } from "@vercel/blob";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { parse, stringify } from "yaml";
import {
  recoilEditorLayoutImage,
  recoilErrorModalState,
} from "../providers/recoil";
import { Button } from "../ui/button";
import { Toaster } from "../ui/toaster";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyLead } from "../ui/typography/TypographyLead";
import { useToast } from "../ui/use-toast";
import SettingElement from "./setting-element";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/forms/notifications/page.tsx
export default function SettingGroupForm({
  existing,
  onDataChange,
  isUserApproved,
  settingGroups,
}: {
  existing: Record<string, any>;
  onDataChange: (field: string, value: any) => void;
  isUserApproved: boolean;
  settingGroups: SettingGroup[];
}) {
  const existingThemesFromConfig = (_config: any) => {
    const _existingThemes = (_config as any)?.image_themes || [];
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
  const [_, setError] = useRecoilState(recoilErrorModalState);

  const [existingThemes, setExistingThemes] = useState<
    { value: string; label: string }[]
  >(existingThemesFromConfig(existing));

  const previewField = async (
    fieldName: string,
    setImagePreviewLoading: (val: boolean) => void,
    setImagePreview: (val: string | undefined) => void,
    setImagePreviewBlock: (val: Block | undefined) => void
  ) => {
    setImagePreviewLoading(true);
    setImagePreview(undefined);

    const response = await fetch(`/api/adventure/generate`, {
      method: "POST",
      body: JSON.stringify({
        operation: "preview",
        id: adventureId,
        data: {
          field_name: fieldName,
          unsaved_server_settings: dataToUpdate,
        },
      }),
    });
    setImagePreviewLoading(false);

    if (!response.ok) {
      const e = {
        title: "Failed to generate preview.",
        message: "The server responded with an error response",
        details: `Status: ${response.status}, StatusText: ${
          response.statusText
        }, Body: ${await response.text()}`,
      };
      setError(e);
      console.error(e);
    } else {
      let block = (await response.json()) as Block;
      setImagePreviewBlock(block);
    }
  };

  // TODO: Send up changes in progress
  const suggestField = async (
    fieldName: string,
    setSuggesting: (val: boolean) => void,
    setValue: (val: string) => void
  ) => {
    setSuggesting(true);
    const response = await fetch(`/api/adventure/generate`, {
      method: "POST",
      body: JSON.stringify({
        operation: "suggest",
        id: adventureId,
        data: {
          field_name: fieldName,
          unsaved_server_settings: dataToUpdate,
        },
      }),
    });

    if (!response.ok) {
      const e = {
        title: "Failed suggestion request.",
        message: "The server responded with an error response",
        details: `Status: ${response.status}, StatusText: ${
          response.statusText
        }, Body: ${await response.text()}`,
      };
      setError(e);
      console.error(e);
    } else {
      let block = (await response.json()) as Block;
      if (block.text) {
        setValue(block.text);
        setSuggesting(false);
      } else if (block.id) {
        const blockContent = await fetch(
          `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`
        );
        const streamedText = await blockContent.text();
        setValue(streamedText);
        setSuggesting(false);
      }
    }
  };

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
        } else {
          const e = {
            title: "Upload failures",
            message: "Unable to upload your image.",
            details: `Status: ${res.status}, StatusText: ${
              res.statusText
            }, Body: ${await res.text()}`,
          };
          setError(e);
          console.error(e);
          return;
        }
      }

      console.log("DATA", data);

      if (data.game_program) {
        if (data.game_program instanceof File) {
          const res = await fetch(
            `/api/adventure/${adventureId}/file?filename=${data.game_program.name}`,
            {
              method: "POST",
              body: data.game_program,
            }
          );
          if (res.ok) {
            const blobJson = (await res.json()) as PutBlobResult;
            data.game_program = blobJson.url;
          } else {
            data.game_program = null;
          }
        }
      }

      const characters = data.characters || [];
      for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        // if the image is a file, then we need to upload it
        if (character.image instanceof File) {
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

      if (typeof dataToSave.themes != "undefined") {
        setExistingThemes(existingThemesFromConfig(dataToSave));
      }

      let res = await fetch(`/api/adventure/${adventureId}`, {
        method: "POST",
        body: JSON.stringify({
          operation: "update",
          id: adventureId,
          data: dataToSave,
        }),
      });

      if (!res.ok) {
        const e = {
          title: "Failed to save data.",
          message: "The server responded with an error response",
          details: `Status: ${res.status}, StatusText: ${
            res.statusText
          }, Body: ${await res.text()}`,
        };
        setError(e);
        console.error(e);
      }

      window?.scrollTo(0, 0);

      // Hard-reload to make sure that the proper "publish" etc bits are set.
      window?.location?.reload();
      return res;
    },
  });

  useEffect(() => {
    if (existing?.adventure_image) {
      setEditorLayoutImage(existing.adventure_image);
    }
  }, []);

  const sg = (settingGroups || []).filter(
    (group) => groupName === group.href
  )[0];

  /*
   * Change Capture
   *
   * We set this upon any change to the form elements, and then the server/agent side only updates
   * those fields which were changed.
   */
  const [dataToUpdate, setDataToUpdate] = useState<Record<string, any>>({});
  const dataToUpdateDirty = !(Object.keys(dataToUpdate).length === 0);

  const [importYaml, setImportYaml] = useState("");

  const onImport = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let data = {};
    try {
      data = parse(importYaml);
    } catch (ex) {
      const e = {
        title: "Failed to import.",
        message: "Unable to parse the YAML.",
        details: `Exception: ${ex}`,
      };
      setError(e);
      console.error(e);
      return;
    }

    fetch(`/api/adventure/${adventureId}`, {
      method: "POST",
      body: JSON.stringify({
        operation: "import",
        id: adventureId,
        data,
      }),
    }).then(
      async (res) => {
        if (!res.ok) {
          const e = {
            title: "Failed to save data.",
            message: "The server responded with an error response",
            details: `Status: ${res.status}, StatusText: ${
              res.statusText
            }, Body: ${await res.text()}`,
          };
          setError(e);
          console.error(e);
          return;
        }

        const { dismiss } = toast({
          title: "Imported",
        });
        setTimeout(() => {
          dismiss();
        }, 2000);
        location.reload();
      },
      (error) => {
        const e = {
          title: "Failed to import.",
          message: "The server responded with an error response",
          details: `Exception: ${error}`,
        };
        setError(e);
        console.error(e);
      }
    );
  };

  const onSave = (e: any) => {
    mutate(dataToUpdate);
  };

  const setKeyValue = (key: string, value: any) => {
    setDataToUpdate((prior) => {
      return { ...prior, [key]: value };
    });
    onDataChange(key, value);
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
        <TypographyH2>{sg.title}</TypographyH2>
        <TypographyLead>{sg.description}</TypographyLead>
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
              adventureId={adventureId as string}
              valueAtLoad={existing ? existing[setting.name] : null}
              existingDynamicThemes={existingThemes}
              isUserApproved={isUserApproved}
              suggestField={suggestField}
              previewField={previewField}
              latestAgentVersion={existing.gameEngineVersionAvailable}
            />
          ))}
          {submittedAt && isSuccess ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckIcon size={14} />
              Adventure Updated
            </div>
          ) : null}
          {dataToUpdateDirty && (
            <Button value="Save" onClick={onSave}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      )}

      <Toaster />
    </div>
  );
}
