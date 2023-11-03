import { Setting } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useState } from "react";
import AdventureTag from "../adventures/adventure-tag";

const TagListElement = ({
  setting,
  value,
  removeItem,
  setValue,
}: {
  setting: Setting;
  value: string[];
  removeItem: (i: number) => void;
  setValue: (tag: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={cn(
        "border border-muted rounded-md px-4 py-2 ",
        focused && "ring-2 ring-ring ring-offset-2 ring-offset-background"
      )}
      onClick={(e) => {
        document.getElementById(setting.label)?.focus();
      }}
    >
      <ul className="flex flex-wrap gap-3">
        {value.map((tag: string, i: number) => (
          <li key={tag}>
            <AdventureTag tag={tag} className="h-8">
              <button
                type="button"
                className="h-4 w-4 bg-gray-600 hover:bg-gray-800 rounded-full flex items-center justify-center text-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(i);
                }}
              >
                <XIcon size={12} />
              </button>
            </AdventureTag>
          </li>
        ))}
        <li className="">
          <input
            id={setting.label}
            type="text"
            className="text-sm bg-background focus:outline-none focus:border-none border-none pt-0"
            placeholder="Add a tag"
            onBlur={() => {
              setFocused(false);
            }}
            onFocus={() => {
              setFocused(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                // @ts-ignore
                setValue((e.target.value as string).toLowerCase());
                // @ts-ignore
                e.target.value = "";
              }
            }}
          />
        </li>
      </ul>
    </div>
  );
};

export default TagListElement;
