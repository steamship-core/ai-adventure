"use client";
import { recoilGameState } from "@/components/providers/recoil";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { BlockContainer } from "./block-container";

const ImageWithFallback = ({
  url,
  itemName,
}: {
  url?: string;
  itemName?: string;
}) => {
  if (url) {
    return <Image src={url} fill alt={itemName || "generated image"} />;
  }
  return (
    <Skeleton
      className={cn("w-full", itemName ? "aspect-square" : "aspect-video")}
    />
  );
};
export const ImageBlock = ({
  block,
  hideOutput,
}: {
  block: Block;
  hideOutput?: boolean;
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const gameState = useRecoilValue(recoilGameState);

  // Make a specific query retry a certain number of times
  const { data: url, error } = useQuery({
    queryKey: ["image-block", block.id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/block/${block.id}`);
        if (res.ok) {
          const respBody = await res.blob();
          return URL.createObjectURL(respBody);
        } else {
          throw Error("failed to fetch image");
        }
      } catch (e) {
        console.log("error fetching image", e);
        throw Error("failed to fetch image");
      }
    },
    retry: 3,
  });

  const item = block.tags?.find(
    (tag) => tag.kind === "item" && tag.name === "name"
  );

  const itemName = item?.value?.["string-value"];
  if (hideOutput) {
    return null;
  }

  const imageContainerClasses = cn(
    "overflow-hidden rounded-md w-full relative mt-4",
    itemName ? "aspect-square" : "aspect-video"
  );
  return (
    <BlockContainer>
      {itemName && <TypographyP>{itemName}</TypographyP>}
      <div className="overflow-hidden rounded-md mt-2">
        {error ? (
          <div
            className={cn(
              "overflow-hidden rounded-md w-full relative aspect-video"
            )}
          >
            <Image src="/adventurer.png" fill alt="generated image" />
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
            <button
              className={imageContainerClasses}
              onClick={() => setIsDialogVisible(true)}
            >
              <ImageWithFallback url={url} itemName={itemName} />
              {!itemName && (
                <div className="absolute z-20 bottom-0 left-0 bg-background/80 w-full">
                  <div className="p-2">
                    <TypographySmall>
                      {gameState?.player?.name} looks around and surveys their
                      surroundings.
                    </TypographySmall>
                  </div>
                </div>
              )}
            </button>
          </>
        )}
      </div>
      <Dialog
        open={isDialogVisible}
        onOpenChange={(open) => setIsDialogVisible(open)}
      >
        <DialogContent className="min-w-[calc(100vw-12rem)] lg:min-w-[calc(100vw-24rem)]">
          {itemName && (
            <DialogHeader>
              <DialogTitle>{itemName}</DialogTitle>
            </DialogHeader>
          )}
          <div className={imageContainerClasses}>
            <ImageWithFallback url={url} itemName={itemName} />
          </div>
        </DialogContent>
      </Dialog>
    </BlockContainer>
  );
};
