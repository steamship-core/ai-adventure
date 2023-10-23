"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
export const ImageBlock = ({ block }: { block: Block }) => {
  const [url, setUrl] = useState<string | undefined>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/block/${block.id}`);
        if (res.ok) {
          const respBody = await res.blob();
          setUrl(URL.createObjectURL(respBody));
        } else {
          setError(true);
        }
      } catch (e) {
        console.log("error fetching image", e);
        setError(true);
      }
    };
    fetchImage();
  }, [block.id]);

  const item = block.tags?.find(
    (tag) => tag.kind === "item" && tag.name === "name"
  );

  const itemName = item?.value?.["string-value"];
  if (itemName) {
    console.log(block);
  }
  return (
    <div>
      {itemName && <TypographyP>{itemName}</TypographyP>}
      <div className="overflow-hidden rounded-md mt-2 md:px-24">
        {error ? (
          <div
            className={cn(
              "overflow-hidden rounded-md w-full relative aspect-video"
            )}
          >
            <Image
              src="/adventurer.png"
              fill
              alt="generated image"
              onError={() => {
                setError(true);
              }}
            />
            <div className="absolute top-0 left-0 z-10 bg-background opacity-80 w-full h-full">
              <div className="flex h-full w-full items-center justify-center">
                <TypographyP className="flex gap-2 items-center">
                  <AlertTriangleIcon size={24} /> This image failed to load
                </TypographyP>
              </div>
            </div>
          </div>
        ) : (
          <>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <div
                className={cn(
                  "overflow-hidden rounded-md w-full relative",
                  itemName ? "aspect-square" : "aspect-video"
                )}
              >
                <Image
                  src={url}
                  fill
                  alt="generated image"
                  onError={() => {
                    setError(true);
                  }}
                />
              </div>
            ) : (
              <Skeleton
                className={cn(
                  "w-full",
                  itemName ? "aspect-square" : "aspect-video"
                )}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
