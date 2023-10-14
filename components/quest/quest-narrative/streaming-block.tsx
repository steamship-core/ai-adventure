"use client";
import { Block } from "@/lib/streaming-client/src";
import { DebugBlock } from "./debug-blocks";
import { useBlockStream } from "./use-block-stream";
import { TextBlock } from "./text-block";
import { useDebugMode } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const { streamedBlock } = useBlockStream({ block });
  const { isDebugMode } = useDebugMode();

  // if (!isDebugMode) {
  return (
    <div
      className={cn(
        "p-2 border border-indigo-600 rounded-md opacity-70 text-sm"
      )}
    >
      <TypographySmall>Streaming</TypographySmall>
      <p>{streamedBlock.text}</p>
    </div>
  );
  // }

  // return <TextBlock text={streamedBlock.text!} />;
};
