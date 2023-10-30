"use client";

import {
  recoilBlockHistory,
  recoilGameState,
} from "@/components/providers/recoil";
import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { inputClassNames } from "@/components/ui/input";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { getGameState } from "@/lib/game/game-state.client";
import { useBackgroundMusic } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics/react";
import { useChat } from "ai/react";
import { ArrowDown, ArrowRightIcon, LoaderIcon, SendIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import TextareaAutosize from "react-textarea-autosize";
import { useRecoilState } from "recoil";
import { Button } from "../../ui/button";
import EndSheet from "../shared/end-sheet";
import { NarrativeBlock } from "./narrative-block";
import { UserInputBlock } from "./user-input-block";
import {
  ExtendedBlock,
  MessageTypes,
  getFormattedBlocks,
  getMessageType,
} from "./utils";

const ScrollButton = () => {
  const { ref, inView } = useInView();

  const scrollToBottom = () => {
    const container = document.getElementById("scroll-end-div");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="w-full" id="anchor">
        <div ref={ref} id="scroll-end-div" className="w-full h-[1px]" />
      </div>
      {!inView && (
        <Button
          onClick={scrollToBottom}
          variant="outline"
          className="absolute bottom-4 right-4 rounded-full aspect-square !p-2 z-50"
        >
          <ArrowDown size={16} />
        </Button>
      )}
    </>
  );
};

const validTypes = [
  MessageTypes.IMAGE,
  MessageTypes.TEXT,
  MessageTypes.STREAMING_BLOCK,
  MessageTypes.ITEM_GENERATION_CONTENT,
] as string[];

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
  agentBaseUrl,
  completeButtonText,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: () => void;
  isComplete: boolean;
  agentBaseUrl: string;
  completeButtonText?: string;
}) {
  const initialized = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const params = useParams<{ handle: string }>();
  const { setUrl: setBackgroundMusicUrl } = useBackgroundMusic();
  const [gg, setGameState] = useRecoilState(recoilGameState);
  const [priorBlocks, setPriorBlocks] = useState<ExtendedBlock[] | undefined>();
  const router = useRouter();
  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    body: {
      context_id: id,
      agentBaseUrl,
    },
    id,
  });

  const scrollToBottom = () => {
    const container = document.getElementById("narrative-container");
    if (container) {
      container.scrollTop = container?.scrollHeight;
    }
  };

  useEffect(() => {
    // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
    // This suppresses the double-loading. My hypothesis is that this is happening in dev as a result of strict mode, but
    // even in dev it messes with the remote agent.
    if (!initialized.current) {
      initialized.current = true;
      // On the first load, get the quest history
      fetch(`/api/game/${params.handle}/quest?questId=${id}`).then(
        async (response) => {
          if (response.ok) {
            let blocks = ((await response.json()) || {})
              .blocks as ExtendedBlock[];
            if (blocks && blocks.length > 0) {
              setPriorBlocks([...blocks]);
            } else {
              // Only once the priorBlocks have been loaded, append a message to chat history to kick off the quest
              // if it hasn't already been started.
              // TODO: We could find a way to kick off the quest proactively.
              append({
                id: "000-000-000",
                content: "Let's go on an adventure!",
                role: "user",
              });
            }
          }
        }
      );
    }
  }, []);

  // TODO: This is duplicated work.
  // TODO: Extend to work with dynamically generated blocks -- that will require us to know the STEAMSHIP_API_BASE
  useEffect(() => {
    if (setBackgroundMusicUrl) {
      if (priorBlocks) {
        for (let block of priorBlocks) {
          if (getMessageType(block) === MessageTypes.SCENE_AUDIO) {
            (setBackgroundMusicUrl as any)(block.streamingUrl);
          }
        }
      }
    }
  }, [priorBlocks]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const updateGameState = async () => {
      const gs = await getGameState(params.handle);
      setGameState(gs);
    };

    if (isComplete) {
      updateGameState();
    }
  }, [isComplete]);

  const formattedBlocks = useMemo(() => {
    const mostRecentMessage =
      messages.length > 0 ? messages[messages.length - 1] : null;
    if (!mostRecentMessage) {
      return [];
    }
    return getFormattedBlocks(mostRecentMessage, null);
  }, [messages]);

  useEffect(() => {
    for (let block of formattedBlocks) {
      if (getMessageType(block) === MessageTypes.SCENE_AUDIO) {
        (setBackgroundMusicUrl as any)(
          `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`
        );
      }
    }
  }, [formattedBlocks]);

  const orderedBlocks = formattedBlocks.filter((block) => {
    const messageType = getMessageType(block);
    return validTypes.includes(messageType);
  });

  const initialBlock = formattedBlocks.find((block) => {
    const messageType = getMessageType(block);
    return validTypes.includes(messageType);
  });

  const [chatHistory, setChatHistory] = useRecoilState(recoilBlockHistory);
  const chatHistoryContainsInitialBlock = chatHistory.includes(
    initialBlock?.id!
  );
  const activeBlock =
    chatHistory.length > 0 && chatHistoryContainsInitialBlock
      ? chatHistory[chatHistory.length - 1]
      : initialBlock?.id;

  const nextBlockIndex =
    orderedBlocks.findIndex((block) => block.id === activeBlock) + 1;

  const nextBlock =
    nextBlockIndex < orderedBlocks.length
      ? orderedBlocks[nextBlockIndex]
      : null;

  let nonPersistedUserInput: string | null = null;

  if (error) {
    return (
      <div className="flex h-full overflow-hidden items-center justify-center flex-col text-center">
        <TypographyH3>An unexpected error occured</TypographyH3>
        <TypographyP>
          We encountered an error while attemping to load this chat session.
          This can happen while we are experiencing heavy traffic.
        </TypographyP>
        <Button onClick={() => router.refresh()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  return (
    <>
      <div className="flex h-full overflow-hidden">
        <QuestNarrativeContainer>
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks}
              offerAudio
              onSummary={onSummary}
              onComplete={onComplete}
              orderedBlocks={orderedBlocks}
              isPrior
            />
          )}
          {messages.map((message) => {
            if (message.role === "user") {
              nonPersistedUserInput = message.content;
              return <UserInputBlock text={message.content} key={message.id} />;
            }
            return (
              <NarrativeBlock
                key={message.id}
                offerAudio
                blocks={getFormattedBlocks(message, nonPersistedUserInput)}
                onSummary={onSummary}
                onComplete={onComplete}
                orderedBlocks={orderedBlocks}
              />
            );
          })}
          <ScrollButton />
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end justify-center flex-col w-full gap-2 h-20 mb-2 pt-1 relative">
        {isComplete && !nextBlock ? (
          <EndSheet
            isEnd={true}
            summary={summary}
            completeButtonText={completeButtonText}
          />
        ) : (
          <>
            {!nextBlock ? (
              <form
                ref={formRef}
                className="flex gap-2 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  inputRef?.current?.focus();
                  track("Send Message", {
                    location: "Quest",
                  });
                  handleSubmit(e);
                  scrollToBottom();
                }}
              >
                <TextareaAutosize
                  className={cn(
                    inputClassNames,
                    "w-full py-[.6rem] resize-none"
                  )}
                  value={input}
                  onChange={handleInputChange}
                  ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      formRef?.current?.requestSubmit();
                    }
                  }}
                  disabled={isLoading || isComplete}
                />
                <Button type="submit" disabled={isLoading || isComplete}>
                  {isLoading ? (
                    <LoaderIcon size={16} className="animate-spin" />
                  ) : (
                    <SendIcon size={16} />
                  )}
                </Button>
              </form>
            ) : (
              <Button
                onClick={() => {
                  if (initialBlock?.id) {
                    const containsInitialBlock = chatHistory.includes(
                      initialBlock?.id
                    );
                    if (!containsInitialBlock) {
                      setChatHistory((prev) => [
                        ...prev,
                        initialBlock.id,
                        nextBlock.id,
                      ]);
                    } else {
                      setChatHistory((prev) => [...prev, nextBlock.id]);
                    }
                  } else {
                    setChatHistory((prev) => [...prev, nextBlock.id]);
                  }
                  setTimeout(() => {
                    scrollToBottom();
                  }, 150);
                }}
                className="w-full"
              >
                Continue <ArrowRightIcon size={18} />
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
