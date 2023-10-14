"use client";
import { Block } from "@/lib/streaming-client/src";
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
  const onFinish = (prompt: string, result: string) => {
    block.text = result;
    onSummary(block);
  };

  const text = useBlockStream({ blockId: block.id, onFinish });
  block.text = text;

  return (
    <DebugBlock block={block} title="Streaming" className="border-indigo-600" />
  );
};
