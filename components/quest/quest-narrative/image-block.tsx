"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ImageBlock = ({ block }: { block: Block }) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/block/${block.id}`);
      const respBody = await res.blob();
      setUrl(URL.createObjectURL(respBody));
    };
    fetchImage();
  }, [block.id]);

  const item = block.tags?.find(
    (tag) => tag.kind === "item" && tag.name === "name"
  );

  const itemName = item?.value?.["string-value"];

  return (
    <div>
      {itemName && <TypographyP>{itemName}</TypographyP>}
      <div className="overflow-hidden rounded-md mt-2 md:px-24">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            className={cn(
              "w-full",
              itemName ? "aspect-square" : "aspect-video"
            )}
            alt="generated image"
          />
        ) : (
          <Skeleton
            className={cn(
              "w-full",
              itemName ? "aspect-square" : "aspect-video"
            )}
          />
        )}
      </div>
    </div>
  );
};
