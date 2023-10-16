"use client";
import { Block } from "@/lib/streaming-client/src";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const text = useBlockStream({ blockId: block.id });
  return <TextBlock text={text} />;
};
