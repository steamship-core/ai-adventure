"use client";
import { Block } from "@steamship/client";
import { DebugBlock } from "./debug-blocks";
import { useBlockStream } from "./use-block-stream";
import { TextBlock } from "./text-block";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const { streamedBlock } = useBlockStream({ block });

  if (process.env.NEXT_PUBLIC_DEBUG_MODE) {
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
