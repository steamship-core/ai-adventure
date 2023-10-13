import { Block } from "@/lib/streaming-client/src";
import { useEffect, useState } from "react";

async function* streamAsyncIterator(stream: ReadableStream) {
  // Get a lock on the stream
  const reader = stream.getReader();

  try {
    while (true) {
      // Read from the stream
      const { done, value } = await reader.read();
      // Exit if we're done
      if (done) return;
      // Else yield the chunk
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export const useBlockStream = ({ block }: { block: Block }) => {
  const [innerBlock, setInnerBlock] = useState<Block>(block);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stream-block", {
          method: "POST",
          body: JSON.stringify({ blockId: block.id }),
        });
        if (!response.ok || !response.body) {
          throw response.statusText;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setIsComplete(true);
            break;
          }

          const decodedChunk = decoder.decode(value, { stream: true });
          setInnerBlock((prev) => ({
            ...prev,
            text: decodedChunk,
          }));
        }
      } catch (error) {
        console.error("block err", error);
        setIsComplete(true);
      }
    };

    fetchData();
  }, []);

  return { streamedBlock: innerBlock, isComplete };
};
