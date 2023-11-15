"use client";
import { Block } from "@/lib/streaming-client/src";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(typeof url != "undefined");

  const onComplete = (b: Block) => {
    if (block && block.id) {
      let streamingUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`;
      setUrl(streamingUrl);
    }
  };

  const refreshBlock = async (blockId: string, workspaceId: string) => {
    let resp = await fetch(`/api/block/${blockId}/meta/${workspaceId}`);
    if (!resp.ok) {
      // TODO: Handle error
      console.log("Error refreshing block", await resp.text());
      return;
    }
    try {
      const b = await resp.json();
      setBlock(b);
    } catch (ex) {
      console.log("error parsing block", ex);
    }
  };

  useEffect(() => {
    if (_block && _block.id && _block.workspaceId) {
      console.log("Block has changed", _block);
      if (_block.streamState == "complete") {
        setLoading(false);
        onComplete(_block);
      } else if (_block.streamState == "started") {
        setLoading(true);
        const interval = setInterval(() => {
          if (url) return;
          console.log("Refreshing", _block, _block.id, _block.workspaceId);
          refreshBlock(_block.id, _block.workspaceId);
        }, 1500);
        return () => {
          clearInterval(interval);
        };
      } else {
        // Error. TODO: Handle this.
      }
    }
  }, [_block]);

  return (
    <div className="overflow-hidden w-24 h-24 mt-1 mb-1">
      {url ? (
        <img src={url} className="w-24 h-24 mt-1 mb-1" />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
};
