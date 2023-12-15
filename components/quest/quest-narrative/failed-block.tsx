import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { BlockContainer } from "./block-container";

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
