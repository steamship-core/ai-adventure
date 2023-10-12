"use client";
import { Block } from "@steamship/client";
import { DebugBlock } from "./debug-blocks";
import { useBlockStream } from "./use-block-stream";
import { useEffect } from "react";

export const QuestSummaryBlock = ({
  block,
  onSummary,
}: {
  block: Block;
  onSummary: (block: Block) => void;
}) => {
  const { streamedBlock, isComplete } = useBlockStream({ block });

  useEffect(() => {
    if (isComplete) {
      onSummary(streamedBlock);
    }
  }, [isComplete, streamedBlock, onSummary]);

  return (
    <DebugBlock
      block={streamedBlock}
      title="Streaming"
      className="border-indigo-600"
    />
  );
};
