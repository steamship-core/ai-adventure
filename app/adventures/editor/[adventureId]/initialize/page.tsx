import EditorInitialization from "@/components/editor/initialization/editor-init";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { getSchema } from "@/lib/agent/agent.server";
import {
  DEPRECATEDSettingGroups,
  Setting,
  SettingGroup,
} from "@/lib/editor/DEPRECATED-editor-options";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function EditorInitPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(params.adventureId);
  if (!adventure) {
    log.error("No adventure");
    throw new Error("no adventure");
  }
  if (adventure.creatorId != userId) {
    log.error(
      `User ${userId} does not have permission to edit ${adventure.id}`
    );
    redirect("/adventures");
  }

  if (!adventure) {
    redirect("/adventures");
  }

  const agentVersionParts = adventure.agentVersion.split("@");
  const agentVersion = agentVersionParts.length > 1 ? agentVersionParts[1] : "";

  let settingGroups: SettingGroup[] = [];
  if (agentVersion?.startsWith("1.")) {
    settingGroups = DEPRECATEDSettingGroups;
  } else {
    const responseJson = await getSchema(adventure.devAgent?.agentUrl!);
    settingGroups = responseJson.settingGroups;
  }

  let requiredSettings: Setting[] = [];
  for (let settingGroup of settingGroups) {
    const requiredSettingsInGroup = settingGroup.settings?.filter(
      (setting) => setting.required || setting.name === "narrative_tone"
    );
    requiredSettings = [
      ...requiredSettings,
      ...(requiredSettingsInGroup || []),
    ];
  }

  const order = [
    "narrative_voice",
    "narrative_tone",
    "name",
    "short_description",
    "description",
    "image",
    "fixed_quest_arc",
  ];
  requiredSettings.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  console.log(requiredSettings);

  return (
    <EditorInitialization
      adventure={adventure}
      requiredSettings={requiredSettings}
    />
  );
}
