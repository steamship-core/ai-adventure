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
}: {
  message: string;
  wasAlreadyComplete: boolean;
}) => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const chunkSize = 5;
  const delay = 50;

  useEffect(() => {
    if (wasAlreadyComplete && currentChunkIndex < message.length) {
      const interval = setInterval(() => {
        const nextChunkEnd = Math.min(
          currentChunkIndex + chunkSize,
          message.length
        );
        const nextChunk = message.substring(currentChunkIndex, nextChunkEnd);
        setChunks((prevChunks) => [...prevChunks, nextChunk]);
        setCurrentChunkIndex(nextChunkEnd);
      }, delay);

      return () => clearInterval(interval);
    }
  }, [message, wasAlreadyComplete, currentChunkIndex, chunkSize, delay]);

  if (!wasAlreadyComplete) {
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
  text,
  blockId,
  offerAudio,
  hideOutput,
  didComplete,
  wasAlreadyComplete = false,
  isPrior,
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
  hideOutput?: boolean;
  didComplete?: boolean;
  wasAlreadyComplete?: boolean;
  isPrior?: boolean;
}) => {
  const [, setContinuationState] = useRecoilState(recoilContinuationState);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (hideOutput) return;
    if (wasAlreadyComplete) {
      setContinuationState(true);
    }
  }, []);

  if (hideOutput) {
    return null;
  }

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
