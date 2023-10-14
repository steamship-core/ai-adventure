import { Block } from "@/lib/streaming-client/src";
import { useEffect } from "react";
import { DebugBlock } from "./debug-blocks";

export const CompletionBlock = ({
  block,
  onComplete,
}: {
  block: Block;
  onComplete: () => void;
}) => {
  useEffect(() => {
    onComplete();
  }, []);

  return (
    <DebugBlock block={block} className="border-red-600" title="User Message" />
  );
};
