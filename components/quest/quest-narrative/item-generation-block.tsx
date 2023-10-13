"use client";
import { Block } from "@/lib/streaming-client/src";
import { useBlockStream } from "./use-block-stream";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyP } from "@/components/ui/typography/TypographyP";

export const ItemGenerationBlock = ({ block }: { block: Block }) => {
  const { streamedBlock } = useBlockStream({ block });

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
        {streamedBlock.text}
      </TypographyP>
    </div>
  );
};
