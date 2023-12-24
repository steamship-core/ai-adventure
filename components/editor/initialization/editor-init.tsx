"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { TypographyLead } from "@/components/ui/typography/TypographyLead";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Setting } from "@/lib/editor/editor-types";
import { suggestField } from "@/lib/editor/suggest-field";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { cn } from "@/lib/utils";
import { Adventure } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageInputElement from "../image-input-element";

const ObjectList = ({
  settings,
  setting,
  requiredSettings,
}: {
  settings: { [key: string]: any };
  setting: Setting;
  requiredSettings: Setting[];
}) => {
  const requiredSetting = requiredSettings.find((s) => s.name === setting.name);
  if (!requiredSetting) return null;

  const listSchema = requiredSetting.listSchema;

  if (!listSchema) return null;

  if (!settings[setting.name] || settings[setting.name]?.length === 0)
    return null;

  return (
    <div className="flex flex-row gap-6 overflow-scroll my-2">
      {settings[setting.name]?.map((item: any, index: number) => (
        <div
          key={item[listSchema[0].name]}
          className="flex flex-col bg-gradient-to-br from-background to-muted/60 rounded-md p-4 min-w-[20rem] border"
        >
          <span className="text-indigo-500 font-bold">{index + 1}</span>

          <div className="flex flex-col gap-2">
            {listSchema.map(
              (schema, i) =>
                item[schema.name] && (
                  <div key={schema.name}>
                    {i === 0 ? (
                      <TypographyLead>{item[schema.name]}</TypographyLead>
                    ) : (
                      <TypographyMuted>{item[schema.name]}</TypographyMuted>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const EditorInitialization = ({
  adventure,
  requiredSettings,
}: {
  adventure: Adventure;
  requiredSettings: Setting[];
}) => {
  const [step, setStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  const legacyMap = {
    name: "adventure_name",
    description: "adventure_description",
    image: "adventure_image",
  };

  const legacyValues = {
    short_description: adventure.shortDescription,
  };
  const [settings, setSettings] = useState<{ [key: string]: any }>(
    requiredSettings.reduce((acc, setting) => {
      // @ts-ignore
      let curValue = adventure.agentConfig?.[setting.name];
      // @ts-ignore
      const devValue = adventure.agentDevConfig?.[setting.name];

      if (devValue && curValue != devValue) {
        // Prefer the devValue if it exists and is different from the curValue
        curValue = devValue;
      }

      if (!curValue) {
        // @ts-ignore

        const legacyKey = legacyMap[setting.name];
        if (legacyKey) {
          // @ts-ignore

          const legacyValue = adventure.agentConfig?.[legacyKey];
          if (legacyValue) {
            // @ts-ignore

            acc[setting.name] = legacyValue;
            return acc;
          }
        }
        // @ts-ignore

        const legacyValue = legacyValues[setting.name];
        if (legacyValue) {
          if (setting.name != "short_description") {
            acc[setting.name] = legacyValue;
            return acc;
            // Edge case for default DB value
          } else if (legacyValue != "An exciting adventure driven by AI") {
            acc[setting.name] = legacyValue;
            return acc;
          }
        }
      } else {
        // @ts-ignore
        acc[setting.name] = adventure.agentConfig?.[setting.name] || undefined;
      }
      return acc;
    }, {} as { [key: string]: any })
  );

  const { adventureId } = useEditorRouting();
  const [error, setError] = useState<string | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const router = useRouter();
  const [isSkipping, setIsSkipping] = useState(false);

  const _suggestField = async (
    fieldName: string,
    fieldKeyPath: (string | number)[],
    type: string
  ) => {
    const result = await suggestField(
      fieldName,
      fieldKeyPath,
      adventureId as string,
      settings
    );
    if (result) {
      return type === "list" && typeof result == "string"
        ? JSON.parse(result)
        : result;
    }
    return null;
  };

  const onSuggestField = async (
    fieldName: string,
    fieldKeyPath: (string | number)[],
    type: string
  ) => {
    setIsSkipping(false);
    setSuggesting(true);
    try {
      const result = await _suggestField(fieldName, fieldKeyPath, type);
      if (result) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          [fieldName]: result,
        }));
      }
    } catch (e) {
      setError("Failed to suggest field");
    }
    setSuggesting(false);
  };

  const skipToEditor = async () => {
    setIsPublishing(true);
    const defaults = {
      narrative_voice: "young adult novel",
      narrative_tone: "silly",
      name: "An exciting adventure driven by AI",
      short_description: "An exciting adventure driven by AI",
      description: "An exciting adventure driven by AI",
      image: "https://ai-adventure.steamship.com/adventurer.png",
      fixed_quest_arc: [],
    };
    await complete(defaults);
  };

  const onSave = async () => {
    setIsPublishing(true);
    setIsSkipping(false);
    const autoGeneratedFields = [];
    if (!adventure.description) {
      autoGeneratedFields.push("description");
    }
    if (!adventure.image) {
      autoGeneratedFields.push("image");
    }
    const settingsCopy = { ...settings };
    for (const field of autoGeneratedFields) {
      try {
        const result = await _suggestField(
          field,
          [field],
          requiredSettings.find((s) => s.name === field)?.type || ""
        );
        if (result) {
          settingsCopy[field] = result;
        }
      } catch (e) {
        console.log("Error!", e);
      }
    }
    await complete(settingsCopy);
  };

  const complete = async (settings: { [x: string]: any }) => {
    let res = await fetch(`/api/adventure/${adventureId}`, {
      method: "POST",
      body: JSON.stringify({
        operation: "update",
        id: adventureId,
        data: settings,
      }),
    });
    if (!res.ok) {
      setError("Failed to create adventure");
      setIsPublishing(false);
      return;
    }
    res = await fetch(`/api/adventure/${adventureId}`, {
      method: "POST",
      body: JSON.stringify({
        operation: "publish",
        id: adventureId,
      }),
    });

    if (res.ok) {
      router.push(
        `/adventures/editor/${adventureId}?initializationSuccess=true`
      );
    } else {
      setError("Failed to create adventure");
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative flex-col">
      <div className="absolute top-0 left-0 w-full h-full -z-20 blur-2xl overflow-hidden">
        <div className="relative w-full h-full opacity-40">
          <div className="absolute top-[14rem] left-[12.5rem] h-44 w-44 bg-indigo-500 rounded-full " />
          <div className="absolute top-[19rem] left-[16.5rem] h-44 w-56 bg-indigo-600 rounded-full " />

          <div className="absolute bottom-32 right-10 h-44 w-44 bg-indigo-500 rounded-full " />
          <div className="absolute bottom-[12rem] right-[15rem] h-44 w-44 bg-indigo-600 rounded-full " />
          <div className="absolute bottom-32 right-20 h-12 w-72 bg-indigo-700 rounded-full" />
        </div>
      </div>
      {error && (
        <div className="w-[35rem] max-w-full mb-8">
          <Alert variant="destructive" className="bg-background">
            <AlertTitle>{error}</AlertTitle>
            <AlertDescription>
              This can happen when we are experiencing a high volume of traffic.
              Please try again or contact us via Discord.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {requiredSettings.map((setting, index) => {
        return (
          <div
            key={setting.name}
            className={`flex flex-col items-center justify-center gap-4 text-center w-[35rem] max-w-full ${
              index === step ? "flex" : "hidden"
            }`}
          >
            <div className="w-full text-left">
              <TypographyP>{setting.onboardingTitle}</TypographyP>
              <TypographyMuted className="text-lg">
                {setting.onboardingSubtitle}
              </TypographyMuted>
            </div>
            <div className="w-full text-left">
              {setting.name !== "fixed_quest_arc" && (
                <Label>{setting.label}</Label>
              )}
              <div
                className={cn(
                  setting.name === "fixed_quest_arc" && "flex-col",
                  "flex gap-2 w-full justify-between"
                )}
              >
                {setting.type === "text" && (
                  <AutoResizeTextarea
                    value={settings?.[setting.name] || ""}
                    onChange={(e) => {
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        [setting.name]: e.target.value,
                      }));
                    }}
                    disabled={suggesting}
                    isLoadingMagic={suggesting}
                    className="w-full"
                    placeholder={setting.default ? `${setting.default}` : ""}
                  />
                )}
                {setting.type === "textarea" && (
                  <AutoResizeTextarea
                    value={settings?.[setting.name] || ""}
                    onChange={(e) => {
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        [setting.name]: e.target.value,
                      }));
                    }}
                    disabled={suggesting}
                    isLoadingMagic={suggesting}
                    className="w-full"
                  />
                )}
                {setting.type === "image" && (
                  <ImageInputElement
                    setting={setting}
                    value={settings?.[setting.name] || ""}
                    onInputChange={(e) => {
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        [setting.name]: e.target.value,
                      }));
                    }}
                  />
                )}
                {setting.type === "list" && setting.listof === "object" && (
                  <ObjectList
                    setting={setting}
                    requiredSettings={requiredSettings}
                    settings={settings}
                  />
                )}
                <div
                  className={cn(
                    setting.name === "fixed_quest_arc" && "w-full",
                    "p-0.5"
                  )}
                >
                  <Button
                    onClick={() => {
                      onSuggestField(
                        setting.name,
                        [setting.name],
                        setting.type
                      );
                    }}
                    disabled={suggesting}
                    variant="secondary"
                    className="w-full"
                  >
                    {suggesting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Suggest"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between gap-2">
                <Button
                  onClick={() => {
                    setIsSkipping(false);
                    setStep(step - 1);
                  }}
                  disabled={step === 0}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    setIsSkipping(false);
                    if (step === requiredSettings.length - 1) {
                      onSave();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={
                    !settings?.[requiredSettings[step].name] ||
                    isPublishing ||
                    suggesting
                  }
                >
                  {step === requiredSettings.length - 1 ? (
                    isPublishing ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Finish"
                    )
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-16">
        {isSkipping ? (
          <Button onClick={() => skipToEditor()}>
            {isPublishing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "I know what I am doing, take me to the editor"
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              setIsSkipping(true);
            }}
          >
            Skip to editor
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorInitialization;
