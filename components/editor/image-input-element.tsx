"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const ImageInputElement = ({
  value,
  onInputChange,
  isDisabled,
}: {
  value: string | string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
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
      {isImageString && (
        <>
          <div className="relative w-44 aspect-[1/1.5] overflow-hidden rounded-md">
            {image === value ? (
              <Image src={image} fill className="object-cover" alt="Image" />
            ) : (
              <img src={image} className="object-cover h-full" alt="Image" />
            )}
          </div>
          <TypographyMuted>Update Image</TypographyMuted>
        </>
      )}
      <Input
        onChange={onChange}
        id="picture"
        type="file"
        className="hover:cursor-pointer"
        disabled={isDisabled}
      />
    </div>
  );
};

export default ImageInputElement;
