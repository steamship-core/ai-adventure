"use client";
import { Setting } from "@/lib/editor/editor-types";
import { Input } from "../ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const ProgramInputElement = ({
  value,
  onInputChange,
  isDisabled,
  setting,
}: {
  value: string | string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  setting: Setting;
}) => {
  return (
    <div className="flex flex-col items-start gap-2">
      {!!value && (
        <TypographyMuted>
          Current Script:{" "}
          <a className="text-blue-600 underline" href={value as string}>
            Download
          </a>
        </TypographyMuted>
      )}
      <Input
        onChange={onInputChange}
        type="file"
        className="hover:cursor-pointer"
        disabled={isDisabled}
      />
    </div>
  );
};

export default ProgramInputElement;
