"use client";

import { Setting } from "@/lib/editor/editor-options";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AudioPreview } from "./audio-preview";

export default function SettingElement({
  setting,
  updateFn,
  valueAtLoad,
  inlined = false,
}: {
  setting: Setting;
  updateFn: (key: string, value: any) => void;
  valueAtLoad: any;
  inlined?: boolean;
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

  const addToList = (e: any) => {
    const newVal =
      setting.listof == "object" ? {} : setting.listof == "text" ? "" : null;
    setValue((old: any) => {
      const ret = [...(Array.isArray(old) ? old : []), newVal];
      updateFn(setting.name, ret);
      return ret;
    });
  };

  const removeItem = (i: number) => {
    setValue((old: any) => {
      const ret = (old || []).filter((_: any, index: number) => {
        return i != index;
      });
      updateFn(setting.name, ret);
      return ret;
    });
  };

  const updateItem = ({
    index,
    subField,
    value,
  }: {
    index: number;
    subField?: string;
    value: any;
  }) => {
    setValue((old: any) => {
      // Go through the old items.
      const ret = (old || []).map((prior: any, thisIndex: number) => {
        // If this is the item being updated.
        if (index === thisIndex) {
          if (subField) {
            // If it's a subfield, the set that subfield assuming it's an object
            // Note: this code only works one layer deep.
            prior[subField] = value;
            return prior;
          } else {
            // Else, it's a primitive value.
            return value;
          }
        } else {
          // If this isn't the item being updated, return as is.
          return prior;
        }
      });
      updateFn(setting.name, ret);
      return ret;
    });
  };

  let innerField = <></>;

  if (setting.type == "text") {
    innerField = <Input type="text" value={value} onChange={onTextboxChange} />;
  } else if (setting.type == "boolean") {
    innerField = (
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
    );
  } else if (setting.type == "select") {
    innerField = (
      <select onChange={onSelectChange} value={value}>
        {setting.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (setting.type == "options") {
    innerField = (
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
    );
  } else if (setting.type == "longtext") {
    innerField = <Textarea onChange={onTextboxChange} value={value} />;
  } else if (setting.type == "list") {
    const _value = Array.isArray(value) ? value : [];
    console.log("value", _value);
    innerField = (
      <div>
        <ul>
          {_value.map((subValue: any, i: number) => {
            const remove = () => {
              removeItem(i);
            };
            return (
              <li
                key={`${setting.name}.${i}`}
                className="flex flex-row items-start space-y-3"
              >
                <button onClick={remove} className="px-4 mt-4">
                  <MinusCircleIcon />
                </button>
                <div className="border-l-4 pl-4 py-4">
                  {setting.listof == "object" ? (
                    (setting.listSchema || []).map((subField) => {
                      return (
                        <SettingElement
                          key={`${setting.name}.${i}.${subField.name}`}
                          valueAtLoad={subValue[subField.name] || []}
                          setting={subField}
                          updateFn={(subFieldName: string, value: any) => {
                            updateItem({
                              index: i,
                              subField: subFieldName,
                              value: value,
                            });
                          }}
                        />
                      );
                    })
                  ) : (
                    <SettingElement
                      key={`${setting.name}.${i}._`}
                      valueAtLoad={subValue || null}
                      setting={{
                        ...setting,
                        type: setting.listof as any,
                      }}
                      inlined={true}
                      updateFn={(_: any, value: any) => {
                        updateItem({ index: i, value: value });
                      }}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <button onClick={addToList} className="flex flex-row items-center mt-4">
          <PlusCircleIcon /> &nbsp; Add New
        </button>
      </div>
    );
  }

  return (
    <div>
      {!inlined && <div className="space-y-6">{setting.label}</div>}
      {!inlined && setting.unused && (
        <div className="text-sm bg-red-200 text-black">
          <b>Coming Soon</b>. This setting isn&apos;t yet wired in to gameplay.
        </div>
      )}
      {!inlined && setting.description && (
        <pre className="text-sm text-muted-foreground">
          {setting.description}
        </pre>
      )}{" "}
      <div>{innerField}</div>
    </div>
  );
}
