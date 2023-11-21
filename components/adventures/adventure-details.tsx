"use client";

import {
  StoryOptions,
  storyOptionsToDisplay,
} from "@/lib/editor/DEPRECATED-editor-options";
import { Adventure } from "@prisma/client";
import { AlertCircleIcon } from "lucide-react";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyH4 } from "../ui/typography/TypographyH4";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const AdventureDetails = ({ adventure }: { adventure: Adventure }) => {
  return (
    <div className="flex flex-col gap-6">
      <TypographyH2 className="border-none">Adventure Details</TypographyH2>
      {storyOptionsToDisplay.map((name) => {
        ``;
        const option = StoryOptions.find((option) => option.name === name);
        if (!option) return null;
        const value = (adventure.agentConfig as unknown as any)?.[name];
        return (
          <div key={name}>
            <TypographyH4>{option.label}</TypographyH4>
            <TypographyMuted>{option.description}</TypographyMuted>
            {!value && (
              <div className="text-xs flex gap-2 my-2 text-yellow-500">
                <AlertCircleIcon size={16} /> This adventure is still using the
                default value for this option.
              </div>
            )}
            <div className="bg-muted rounded-md px-2 py-2 mt-3 whitespace-break-spaces">
              {value ? <span>{value}</span> : <span>{option.default}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdventureDetails;
