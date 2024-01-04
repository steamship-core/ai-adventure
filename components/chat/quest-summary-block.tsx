"use client";
import { Block } from "@/lib/streaming-client/src";
import { DebugBlock } from "./debug-blocks";
import { useBlockStream } from "./use-block-stream";

export const QuestSummaryBlock = ({ block }: { block: Block }) => {
  const onFinish = (prompt: string, result: string) => {
    block.text = result;
  };

  const { completion } = useBlockStream({ blockId: block.id, onFinish });

  if (!block.text && block.id) {
    block.text = completion;
  }

  return (
    <DebugBlock block={block} title="Streaming" className="border-indigo-600" />
  );
};
