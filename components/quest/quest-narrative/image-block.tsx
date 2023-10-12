"use client";
import { Block } from "@steamship/client";
import { useEffect, useState } from "react";

export const ImageBlock = ({ block }: { block: Block }) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/block/${block.id}`);
      const body = await res.blob();
      setUrl(URL.createObjectURL(body));
    };
    if (!url) {
      fetchImage();
    }
  }, [block.id]);

  return (
    <div>
      image block
      {url && <img src={url} height={500} width={500} alt="generated image" />}
    </div>
  );
};
