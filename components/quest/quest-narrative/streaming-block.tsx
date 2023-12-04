"use client";
import { Block } from "@/lib/streaming-client/src";
import { useMemo, useState } from "react";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

const CompletionBlock = ({
  block,
  offerAudio,
  hideOutput,
}: {
  block: Block;
  offerAudio?: boolean;
  hideOutput?: boolean;
}) => {
  const wasAlreadyComplete = useMemo(
    () => block?.streamState !== "complete",
    []
  );
  const [didComplete, setDidComplete] = useState(false);
  const alreadyFinishedAndOfferAudio =
    block?.streamState === "complete" && offerAudio === true;
  const [finishedAndOfferAudio, setFinishedAndOfferAudio] = useState(false);

  const onFinish = () => {
    setFinishedAndOfferAudio(offerAudio === true);
    setDidComplete(true);
  };
  const { completion } = useBlockStream({ blockId: block.id, onFinish });

  return (
    <TextBlock
      blockId={block.id}
      offerAudio={alreadyFinishedAndOfferAudio || finishedAndOfferAudio}
      text={completion}
      useTypeEffect={wasAlreadyComplete}
      didComplete={didComplete}
      hideOutput={hideOutput}
    />
  );
};

export const StreamingBlock = ({
  block,
  offerAudio,
  hideOutput,
}: {
  block: Block;
  offerAudio?: boolean;
  hideOutput?: boolean;
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
        useTypeEffect={false}
        didComplete={true}
        hideOutput={hideOutput}
      />
    );
  }

  return (
    <CompletionBlock
      block={block}
      offerAudio={offerAudio}
      hideOutput={hideOutput}
    />
  );
};
