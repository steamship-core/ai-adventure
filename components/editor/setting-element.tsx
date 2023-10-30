"use client";

import { Setting } from "@/lib/editor/editor-options";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AudioPreview } from "./audio-preview";

export default function SettingElement({
  setting,
  updateFn,
}: {
  setting: Setting;
  updateFn: (key: string, value: any) => void;
}) {
  const onTextboxChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    updateFn(setting.name, newValue);
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked === true;
    updateFn(setting.name, newValue);
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    updateFn(setting.name, newValue);
  };

  return (
    <div>
      <div className="space-y-6">{setting.label}</div>
      {setting.description && (
        <pre className="text-sm text-muted-foreground">
          {setting.description}
        </pre>
      )}
      <div>
        {setting.type == "text" ? (
          <Input type="text" onChange={onTextboxChange} />
        ) : setting.type == "select" ? (
          <select onChange={onSelectChange}>
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : setting.type == "boolean" ? (
          <div key={setting.name}>
            <Input
              type="checkbox"
              id={setting.name}
              name={setting.name}
              onChange={onCheckboxChange}
            />
            <label htmlFor={setting.name}>&nbsp;Yes</label>
          </div>
        ) : setting.type == "options" ? (
          <div className="space-y-2">
            {setting.options?.map((option) => (
              <div key={option.value} className="flex flex-row items-start">
                <Input
                  type="radio"
                  id={option.value}
                  name={setting.name}
                  value={option.value}
                  onChange={onTextboxChange}
                />
                <label className="select-none" htmlFor={option.value}>
                  <div className="flex flex-row">
                    {option?.audioSample && (
                      <AudioPreview voiceId={option.audioSample} />
                    )}
                    {option.label}
                  </div>
                  {option.description && (
                    <pre className="text-sm text-muted-foreground">
                      {option.description}
                    </pre>
                  )}
                </label>
              </div>
            ))}
          </div>
        ) : setting.type == "longtext" ? (
          <Textarea onChange={onTextboxChange}></Textarea>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
