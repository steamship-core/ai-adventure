"use client";
import { Block } from "@/lib/streaming-client/src";
import { useBlockStream } from "./use-block-stream";
import { TextBlock } from "./text-block";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const { streamedBlock } = useBlockStream({ block });

  return <TextBlock text={streamedBlock.text!} />;
};
