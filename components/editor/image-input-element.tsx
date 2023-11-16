"use client";
import { Setting } from "@/lib/editor/editor-options";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const ImageInputElement = ({
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
  const [image, setImage] = useState<string | string[]>(value);
  const isImageString = typeof image === "string";
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
    const blobUrl = URL.createObjectURL(e.target.files![0]);
    setImage(blobUrl);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {isImageString && image.replace(/\s/g, "") && (
        <>
          <div
            className={cn(
              "relative overflow-hidden rounded-md",
              setting.name === "adventure_image"
                ? "h-52 aspect-video"
                : "w-44 aspect-[1/1.5]"
            )}
          >
            {image === value ? (
              <Image src={image} fill className="object-cover" alt="Image" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} className="object-cover h-full" alt="Image" />
            )}
          </div>
          <TypographyMuted>Update Image</TypographyMuted>
        </>
      )}
      <Input
        onChange={onChange}
        type="file"
        className="hover:cursor-pointer"
        disabled={isDisabled}
      />
    </div>
  );
};

export default ImageInputElement;
