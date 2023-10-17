"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Block } from "@/lib/streaming-client/src";
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

  return (
    <div>
      {item && <TypographyP>{item?.value?.["string-value"]}</TypographyP>}
      <div className="overflow-hidden rounded-md mt-2">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            className="w-full aspect-square"
            alt="generated image"
          />
        ) : (
          <Skeleton className="w-full aspect-square" />
        )}
      </div>
    </div>
  );
};
