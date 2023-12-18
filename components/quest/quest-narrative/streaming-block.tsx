"use client";
import { recoilContinuationState } from "@/components/providers/recoil";
import { Block } from "@/lib/streaming-client/src";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

const CompletionBlock = ({
  block,
  offerAudio,
  hideOutput,
  isPrior,
}: {
  block: Block;
  offerAudio?: boolean;
  hideOutput?: boolean;
  isPrior?: boolean;
}) => {
  const [, setContinuationState] = useRecoilState(recoilContinuationState);

  const [didComplete, setDidComplete] = useState(false);
  const alreadyFinishedAndOfferAudio =
    block?.streamState === "complete" && offerAudio === true;
  const [finishedAndOfferAudio, setFinishedAndOfferAudio] = useState(false);

  const onFinish = () => {
    setFinishedAndOfferAudio(offerAudio === true);
  };

  const onFinishedRendering = () => {
    setDidComplete(true);
    setContinuationState(true);
  };

  const { completion } = useBlockStream({ blockId: block.id, onFinish });

  return (
    <TextBlock
      blockId={block.id}
      offerAudio={alreadyFinishedAndOfferAudio || finishedAndOfferAudio}
      text={completion}
      wasAlreadyComplete={false}
      didComplete={didComplete}
      hideOutput={hideOutput}
      isPrior={isPrior}
      onFinishedRendering={onFinishedRendering}
    />
  );
};

export const StreamingBlock = ({
  block,
  offerAudio,
  hideOutput,
  isPrior,
}: {
  block: Block;
  offerAudio?: boolean;
  hideOutput?: boolean;
  isPrior?: boolean;
}) => {
  const wasAlreadyComplete = useMemo(
    () => block?.streamState === "complete",
    []
  );

  const alreadyFinishedAndOfferAudio =
    block?.streamState === "complete" && offerAudio === true;

  if (hideOutput) {
    return null;
  }
  if (wasAlreadyComplete) {
    return (
      <TextBlock
        blockId={block.id}
        offerAudio={alreadyFinishedAndOfferAudio}
        text={block.text!}
        wasAlreadyComplete={true}
        didComplete={true}
        hideOutput={hideOutput}
        isPrior={isPrior}
      />
    );
  }

  return (
    <CompletionBlock
      block={block}
      offerAudio={offerAudio}
      hideOutput={hideOutput}
      isPrior={isPrior}
    />
  );
};
