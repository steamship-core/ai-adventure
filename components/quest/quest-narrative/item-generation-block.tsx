"use client";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { Block } from "@/lib/streaming-client/src";
import { useMemo } from "react";
import { BlockContainer } from "./block-container";
import { useBlockStream } from "./use-block-stream";

const CompletionBlock = ({
  block,
  hideOutput,
}: {
  block: Block;
  hideOutput: boolean;
}) => {
  const text = useBlockStream({ blockId: block.id });
  if (hideOutput) {
    return null;
  }
  return (
    <BlockContainer
      className={"p-4 border border-foreground/50 rounded-md flex flex-col"}
    >
      <TypographyLarge>Item Found! 🎉</TypographyLarge>
      <TypographyP className="whitespace-pre-wrap text-sm">{text}</TypographyP>
    </BlockContainer>
  );
};

export const ItemGenerationBlock = ({
  block,
  hideOutput,
}: {
  block: Block;
  hideOutput: boolean;
}) => {
  const wasAlreadyComplete = useMemo(
    () => block?.streamState === "complete",
    []
  );

  if (wasAlreadyComplete) {
    return (
      <BlockContainer
        className={"p-4 border border-foreground/50 rounded-md flex flex-col"}
      >
        <TypographyLarge>Item Found! 🎉</TypographyLarge>
        <TypographyP className="whitespace-pre-wrap text-sm">
          {block.text}
        </TypographyP>
      </BlockContainer>
    );
  }
  return <CompletionBlock block={block} hideOutput={hideOutput} />;
};
