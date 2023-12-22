import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { BlockContainer } from "./block-container";

export const FailedBlock = ({ block }: { block: Block }) => {
  return (
    <BlockContainer>
      <div
        data-blocktype="text-block"
        className={cn("whitespace-pre-wrap text-normal  rounded-md")}
      >
        Oh no! You&apos;ve failed your quest... But you know what they say,
        &quot;If at first you don&apos;t succeed, try, try again!&quot;
      </div>
    </BlockContainer>
  );
};
