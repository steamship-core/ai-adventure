"use client";
import { Block } from "@/lib/streaming-client/src";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilErrorModalState } from "../providers/recoil";
import { Skeleton } from "../ui/skeleton";

export const ImagePreview = ({
  block,
  url,
}: {
  block?: Block;
  url?: string;
}) => {
  const [_block, setBlock] = useState(block);
  const [_url, setUrl] = useState(url);
  const [_, setError] = useRecoilState(recoilErrorModalState);

  const onComplete = (b: Block) => {
    console.log(b);
    if (b && b.id) {
      let streamingUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${b.id}/raw`;
      console.log(streamingUrl);
      setUrl(streamingUrl);
    }
  };

  const refreshBlock = async (blockId: string, workspaceId: string) => {
    if (!blockId) {
      const e = {
        title: "Error checking status.",
        message: "Attempted to check the status of an empty block.",
        details: `blockId was undefined.`,
      };
      setError(e);
      console.error(e);
      return;
    }

    if (!workspaceId) {
      const e = {
        title: "Error checking status.",
        message:
          "Attempted to check the status of a block from an unknown workspace.",
        details: `workspaceId was undefined.`,
      };
      setError(e);
      console.error(e);
      return;
    }

    setUrl(undefined);

    let resp = await fetch(`/api/block/${blockId}/meta/${workspaceId}`);
    if (!resp.ok) {
      const e = {
        title: "Failed to fetch image preview.",
        message: "The image being generated could not be fetched.",
        details: `Status: ${resp.status}, StatusText: ${
          resp.statusText
        }, Body: ${await resp.text()}`,
      };
      setError(e);
      console.error(e);
      return;
    }
    try {
      const b = await resp.json();
      setBlock(b);
    } catch (ex) {
      const e = {
        title: "Failed to display image preview.",
        message: "Unable to parse the image block response.",
        details: `Exception: ${ex}`,
      };
      setError(e);
      console.error(e);
    }
  };

  useEffect(() => {
    if (_block && _block?.id && _block?.workspaceId) {
      setUrl(undefined);
      if (_block.streamState == "complete") {
        onComplete(_block);
      } else if (_block.streamState == "started") {
        setTimeout(() => {
          if (url) return;
          console.log("Refreshing", _block, _block.id, _block.workspaceId);
          refreshBlock(_block.id, _block.workspaceId);
        }, 1500);
      } else {
        const e = {
          title: "Generating preview image failed.",
          details: `Streaming State: ${block?.streamState}`,
        };
        setError(e);
        console.error(e);
      }
    }
  }, [_block]);

  return (
    <div className="overflow-hidden w-24 h-24 mt-1 mb-1">
      {_url ? (
        <img src={_url} className="w-24 h-24 mt-1 mb-1" />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
};
