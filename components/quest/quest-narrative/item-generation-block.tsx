"use client";
import { activeStreams } from "@/components/providers/recoil";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { useRecoilCounter } from "@/lib/recoil-utils";
import { Block } from "@/lib/streaming-client/src";
import { useEffect, useMemo } from "react";
import { BlockContainer } from "./block-container";
import { useBlockStream } from "./use-block-stream";

const CompletionBlock = ({
  block,
  hideOutput,
}: {
  block: Block;
  hideOutput: boolean;
}) => {
  const { streamStart, streamEnd } = useRecoilCounter(activeStreams);

  useEffect(() => {
    if (block.id) {
      streamStart(block.id);
    }
  }, [block]);
  const { completion } = useBlockStream({
    blockId: block.id,
    onFinish: () => {
      streamEnd(block.id);
    },
  });
  if (hideOutput) {
    return null;
  }
  return (
    <BlockContainer
      className={"p-4 border border-foreground/50 rounded-md flex flex-col"}
    >
      <TypographyLarge>Item Found! 🎉</TypographyLarge>
      <TypographyP className="whitespace-pre-wrap text-sm">
        {completion}
      </TypographyP>
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
