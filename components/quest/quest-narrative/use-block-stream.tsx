import { Block } from "@steamship/client";
import { useEffect, useState } from "react";

export const useBlockStream = ({ block }: { block: Block }) => {
  const [innerBlock, setInnerBlock] = useState<Block>(block);
  const [isComplete, setIsComplete] = useState(false);

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
          setIsComplete(true);
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
            if (newBlock.text && newBlock.text.trim() !== "") {
              setInnerBlock((prev) => ({ ...prev, text: newBlock.text }));
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    if (!isComplete) {
      console.log("reading stream");
      readStream();
    }
  }, [block.id]);

  return { streamedBlock: innerBlock, isComplete };
};
