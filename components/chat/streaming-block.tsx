"use client";
import { activeStreams } from "@/components/providers/recoil";
import { useRecoilCounter } from "@/lib/recoil-utils";
import { Block } from "@/lib/streaming-client/src";
import { useEffect, useMemo, useState } from "react";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

const CompletionBlock = ({
  block,
  offerAudio,
  isPrior,
}: {
  block: Block;
  offerAudio?: boolean;
  isPrior?: boolean;
}) => {
  const { streamStart, streamEnd } = useRecoilCounter(activeStreams);

  const [didComplete, setDidComplete] = useState(false);
  const alreadyFinishedAndOfferAudio =
    block?.streamState === "complete" && offerAudio === true;
  const [finishedAndOfferAudio, setFinishedAndOfferAudio] = useState(false);

  const onFinish = () => {
    setFinishedAndOfferAudio(offerAudio === true);
  };

  useEffect(() => {
    if (block.id) {
      streamStart(block.id);
    }
  }, [block]);

  const onFinishedRendering = () => {
    setDidComplete(true);
    streamEnd(block.id);
  };

  const { completion } = useBlockStream({ blockId: block.id, onFinish });

  return (
    <TextBlock
      blockId={block.id}
      offerAudio={alreadyFinishedAndOfferAudio || finishedAndOfferAudio}
      text={completion}
      wasAlreadyComplete={false}
      didComplete={didComplete}
      isPrior={isPrior}
      onFinishedRendering={onFinishedRendering}
    />
  );
};

export const StreamingBlock = ({
  block,
  offerAudio,
  isPrior,
}: {
  block: Block;
  offerAudio?: boolean;
  isPrior?: boolean;
}) => {
  const wasAlreadyComplete = useMemo(
    () => block?.streamState === "complete",
    []
  );

  const alreadyFinishedAndOfferAudio =
    block?.streamState === "complete" && offerAudio === true;

  if (wasAlreadyComplete) {
    return (
      <TextBlock
        blockId={block.id}
        offerAudio={alreadyFinishedAndOfferAudio}
        text={block.text!}
        wasAlreadyComplete={true}
        didComplete={true}
        isPrior={isPrior}
      />
    );
  }

  return (
    <CompletionBlock block={block} offerAudio={offerAudio} isPrior={isPrior} />
  );
};
