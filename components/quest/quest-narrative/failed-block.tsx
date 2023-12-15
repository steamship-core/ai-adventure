import { Block } from "@/lib/streaming-client/src";
import { useEffect } from "react";
import { DebugBlock } from "./debug-blocks";

export const FailedBlock = ({
  block,
  onComplete,
}: {
  block: Block;
  onComplete: (failed?: boolean) => void;
}) => {
  useEffect(() => {
    onComplete(true);
  }, []);

  return (
    <DebugBlock block={block} className="border-red-600" title="Failed Block" />
  );
};
