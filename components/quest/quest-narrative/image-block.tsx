"use client";
import { Block } from "@steamship/client";
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

  return (
    <div>
      <div className="overflow-hidden h-44 w-44 rounded-md">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} className="h-full w-full" alt="generated image" />
        )}
      </div>
    </div>
  );
};
