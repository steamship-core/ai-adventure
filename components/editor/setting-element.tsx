"use client";

import { Setting } from "@/lib/game/editor/editor-options";

export default function SettingElement({ setting }: { setting: Setting }) {
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
          <input type="text" />
        ) : setting.type == "select" ? (
          <select>
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : setting.type == "boolean" ? (
          <div key={setting.name}>
            <input type="checkbox" id={setting.name} name={setting.name} />
            <label htmlFor={setting.name}>&nbsp;Yes</label>
          </div>
        ) : setting.type == "options" ? (
          <div>
            {setting.options?.map((option) => (
              <div key={option.value}>
                <input
                  type="radio"
                  id={setting.name}
                  name={option.value}
                  value={option.value}
                />
                <label htmlFor={setting.name}>
                  {option.label}
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
          <textarea></textarea>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
