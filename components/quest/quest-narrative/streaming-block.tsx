"use client";
import { Block } from "@/lib/streaming-client/src";
import { DebugBlock } from "./debug-blocks";
import { useBlockStream } from "./use-block-stream";
import { TextBlock } from "./text-block";
import { useDebugMode } from "@/lib/hooks";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const { streamedBlock } = useBlockStream({ block });
  const { isDebugMode } = useDebugMode();

  if (isDebugMode) {
    return (
      <DebugBlock
        block={streamedBlock}
        title="Streaming"
        className="border-indigo-600"
      />
    );
  }

  return <TextBlock text={streamedBlock.text!} />;
};
