"use client";
import { Block } from "@steamship/client";
import { DebugBlock } from "./debug-blocks";
import { useEffect, useState } from "react";
import { TextBlock } from "./text-block";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const [innerBlock, setInnerBlock] = useState<Block>(block);

  useEffect(() => {
    const readStream = async () => {
      const response = await fetch("/api/stream-block", {
        method: "POST",
        body: JSON.stringify({ blockId: block.id }),
      });
      if (!response.ok) {
        console.log("not ok");
        return;
      }
      if (!response.body) {
        console.log("not body");
        return;
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        let decodedChunk = null;

        try {
          decodedChunk = new TextDecoder().decode(value);
        } catch (ex) {
          console.log(ex);
        }
        if (decodedChunk) {
          const chunks = decodedChunk.split("\n").filter((c) => c);
          const mostRecentChunk = chunks[chunks.length - 1];
          try {
            const newBlock = JSON.parse(mostRecentChunk);
            setInnerBlock(newBlock);
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    readStream();
  }, [block.id]);

  return <TextBlock text={innerBlock.text || ""} />;
};
