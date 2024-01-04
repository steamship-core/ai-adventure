"use client";
import { Setting } from "@/lib/editor/editor-types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
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
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isImageString = typeof image === "string";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    onInputChange(e);
    const blobUrl = URL.createObjectURL(e.target.files![0]);
    setImage(blobUrl);
    setIsLoading(false);
  };

  const loadImage = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    setImage(blobUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    loadImage(value as string);
  }, [value]);

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      {(image || isLoading) && (
        <>
          <div
            className={cn(
              "relative overflow-hidden rounded-md",
              setting.name === "image"
                ? "h-52 aspect-video"
                : "w-44 aspect-[1/1.5]"
            )}
          >
            {isLoading || !image ? (
              <Skeleton className="rounded-md overflow-hidden h-full w-full" />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  className="object-cover h-full w-full rounded-md overflow-hidden"
                  alt="Image"
                />
              </>
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
