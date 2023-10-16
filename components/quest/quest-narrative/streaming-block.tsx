"use client";
import { Block } from "@/lib/streaming-client/src";
import { useState } from "react";
import { TextBlock } from "./text-block";
import { useBlockStream } from "./use-block-stream";

export const StreamingBlock = ({
  block,
  offerAudio,
}: {
  block: Block;
  offerAudio?: boolean;
}) => {
  const alreadyFinishedAndOfferAudio =
    block?.streamState === "completed" && offerAudio === true;
  const [finishedAndOfferAudio, setFinishedAndOfferAudio] = useState(false);
  const onFinish = () => {
    setFinishedAndOfferAudio(offerAudio === true);
  };
  const text = useBlockStream({ blockId: block.id, onFinish });
  return (
    <TextBlock
      blockId={block.id}
      offerAudio={alreadyFinishedAndOfferAudio || finishedAndOfferAudio}
      text={text}
    />
  );
};
