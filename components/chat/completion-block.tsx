import { Block } from "@/lib/streaming-client/src";
import { DebugBlock } from "./debug-blocks";

export const CompletionBlock = ({ block }: { block: Block }) => {
  return (
    <DebugBlock
      block={block}
      className="border-red-600"
      title="Completion Block"
    />
  );
};
