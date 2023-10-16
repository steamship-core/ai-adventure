"use client";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Block } from "@/lib/streaming-client/src";
import { useBlockStream } from "./use-block-stream";

export const ItemGenerationBlock = ({ block }: { block: Block }) => {
  const text = useBlockStream({ blockId: block.id });

  return (
    <div className={"p-4 border border-foreground/50 rounded-md flex flex-col"}>
      <TypographyLarge>Item Found! 🎉</TypographyLarge>
      <TypographyP className="whitespace-pre-wrap text-sm">{text}</TypographyP>
    </div>
  );
};
