"use client";
import { useDebugMode } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

export const StreamingBlock = ({ block }: { block: Block }) => {
  const text = useBlockStream({ blockId: block.id });
  const { isDebugMode } = useDebugMode();

  // if (!isDebugMode) {
  // return (
  //   <div
  //     className={cn(
  //       "p-2 border border-indigo-600 rounded-md opacity-70 text-sm"
  //     )}
  //   >
  //     <TypographySmall>Streaming</TypographySmall>
  //     <p>{text}</p>
  //   </div>
  // );
  // }

  return <TextBlock text={text} />;
};
