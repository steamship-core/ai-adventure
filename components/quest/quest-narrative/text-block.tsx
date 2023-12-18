import { useRecoilState } from "recoil";
import { BlockContainer } from "./block-container";
import { NarrationPlayer } from "./narration-player";

import { recoilContinuationState } from "@/components/providers/recoil";
import { addNewlines } from "@/lib/text";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const FadingText = ({ text }: { text: string }) => {
  return <span className="fadeIn">{text}</span>;
};

const MessageDisplay = ({
  message,
  wasAlreadyComplete,
  onFinishedRendering,
}: {
  message: string;
  wasAlreadyComplete: boolean;
  onFinishedRendering?: () => void;
}) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const chunkSize = 5;
  const delay = 50;

  useEffect(() => {
    if (!wasAlreadyComplete && currentChunkIndex < message.length) {
      const interval = setInterval(() => {
        const nextChunkEnd = Math.min(
          currentChunkIndex + chunkSize,
          message.length
        );
        const nextChunk = message.substring(currentChunkIndex, nextChunkEnd);
        setChunks((prevChunks) => [...prevChunks, nextChunk]);
        setCurrentChunkIndex(nextChunkEnd);
        if (nextChunkEnd >= message.length) {
          onFinishedRendering?.();
        }
      }, delay);

      return () => clearInterval(interval);
    }
  }, [message, wasAlreadyComplete, currentChunkIndex, chunkSize, delay]);

  if (wasAlreadyComplete) {
    return <FadingText text={message} />;
  }

  return (
    <div>
      {chunks.map((chunk, index) => (
        <FadingText key={index} text={chunk} />
      ))}
    </div>
  );
};

export const TextBlock = ({
  hideOutput,
  ...rest
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
  hideOutput?: boolean;
  didComplete?: boolean;
  wasAlreadyComplete?: boolean;
  isPrior?: boolean;
  onFinishedRendering?: () => void;
}) => {
  if (hideOutput) {
    return null;
  }

  return <TextBlockInner {...rest} />;
};

export const TextBlockInner = ({
  text,
  blockId,
  offerAudio,
  didComplete,
  wasAlreadyComplete = false,
  isPrior,
  onFinishedRendering,
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
  didComplete?: boolean;
  wasAlreadyComplete?: boolean;
  isPrior?: boolean;
  onFinishedRendering?: () => void;
}) => {
  const [, setContinuationState] = useRecoilState(recoilContinuationState);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setContinuationState(false);
  }, []);

  const _text = addNewlines(text);

  return (
    <BlockContainer>
      <div
        data-blocktype="text-block"
        className={cn(
          "whitespace-pre-wrap text-normal  rounded-md",
          isHover && "bg-sky-300/10"
        )}
      >
        {!text ? (
          <Loader className="animate-spin" />
        ) : (
          <>
            {!isPrior ? (
              <MessageDisplay
                message={_text}
                wasAlreadyComplete={wasAlreadyComplete}
                onFinishedRendering={onFinishedRendering}
              />
            ) : (
              <span>{_text}</span>
            )}
          </>
        )}
      </div>
      {blockId && offerAudio && didComplete && (
        <div className="w-full flex items-center justify-center mt-2">
          <div className="w-full px-2">
            <div className="border-t border-foreground/20 w-full px-2" />
          </div>
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <NarrationPlayer blockId={blockId} />
          </div>
          <div className="w-full px-2">
            <div className="border-t border-foreground/20 w-full px-2" />
          </div>
        </div>
      )}
    </BlockContainer>
  );
};
