"use client";

import { Setting } from "@/lib/editor/editor-options";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AudioPreview } from "./audio-preview";

export default function SettingElement({
  setting,
  updateFn,
  valueAtLoad,
}: {
  setting: Setting;
  updateFn: (key: string, value: any) => void;
  valueAtLoad: any;
}) {
  let [value, setValue] = useState(valueAtLoad);

  const onTextboxChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked === true;
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateFn(setting.name, newValue);
  };

  return (
    <div>
      <div className="space-y-6">{setting.label}</div>
      {setting.unused && (
        <div className="text-sm bg-red-200">
          <b>Coming Soon</b>. This setting isn't yet wired in to gameplay.
        </div>
      )}
      {setting.description && (
        <pre className="text-sm text-muted-foreground">
          {setting.description}
        </pre>
      )}{" "}
      <div>
        {setting.type == "text" ? (
          <Input type="text" value={value} onChange={onTextboxChange} />
        ) : setting.type == "select" ? (
          <select onChange={onSelectChange} value={value}>
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
              checked={value ? true : undefined}
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
                  checked={value === option.value ? true : undefined}
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
          <Textarea onChange={onTextboxChange}>{value}</Textarea>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
