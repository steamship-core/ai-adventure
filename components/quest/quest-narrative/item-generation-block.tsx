"use client";
import { Block } from "@/lib/streaming-client/src";
// import { useBlockStream } from "./use-block-stream";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { useBlockStream } from "./use-block-stream";

export const ItemGenerationBlock = ({ block }: { block: Block }) => {
  const text = useBlockStream({ blockId: block.id });

  return (
    <div
      className={
        "p-4 border border-yellow-500 bg-foreground rounded-md flex flex-col gap-6"
      }
    >
      <TypographyLarge className="text-background">
        Item Found! 🎉
      </TypographyLarge>
      <TypographyP className="text-background whitespace-pre-wrap text-sm">
        {text}
      </TypographyP>
    </div>
  );
};
