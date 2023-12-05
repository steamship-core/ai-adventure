import { Setting, SettingGroup } from "./DEPRECATED-editor-options";

const excludedSettings = ["description", "image"];
export const getRequiredFields = (settingGroups: SettingGroup[]) => {
  let requiredSettings: Setting[] = [];
  for (let settingGroup of settingGroups) {
    const requiredSettingsInGroup = settingGroup.settings?.filter(
      (setting) =>
        (setting.required || setting.name === "narrative_tone") &&
        !excludedSettings.includes(setting.name)
    );
    requiredSettings = [
      ...requiredSettings,
      ...(requiredSettingsInGroup || []),
    ];
  }
  return requiredSettings;
};
