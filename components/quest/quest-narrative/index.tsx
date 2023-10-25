"use client";

import {
  recoilAudioActiveState,
  recoilBlockHistory,
  recoilGameState,
} from "@/components/providers/recoil";
import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { inputClassNames } from "@/components/ui/input";
import { getGameState } from "@/lib/game/game-state.client";
import { useBackgroundMusic } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics/react";
import { useChat } from "ai/react";
import { ArrowDown, ArrowRightIcon, LoaderIcon, SendIcon } from "lucide-react";
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

  const [_, _2, _3, setBackgroundMusicUrl] = useBackgroundMusic();
  const [offerAudio, _4] = useRecoilState(recoilAudioActiveState);
  const [gg, setGameState] = useRecoilState(recoilGameState);
  const [priorBlocks, setPriorBlocks] = useState<ExtendedBlock[] | undefined>();

  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
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
      fetch(`/api/game/quest?questId=${id}`).then(async (response) => {
        if (response.ok) {
          let blocks = ((await response.json()) || {})
            .blocks as ExtendedBlock[];
          if (blocks && blocks.length > 0) {
            console.log("got blocks", [...blocks]);
            // let reversedArray = [];
            // for (let i = blocks.length - 1; i >= 0; i--) {
            //   console.log(blocks[i]);
            //   reversedArray.push(blocks[i]);
            // }
            // console.log("reveresed blocks", reversedArray);
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
      });
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
      const gs = await getGameState();
      setGameState(gs);
    };

    if (isComplete) {
      updateGameState();
    }
  }, [isComplete]);

  const formattedBlocks = useMemo(() => {
    const mostRecentUserMessage =
      messages.length > 0 ? messages[messages.length - 1] : null;
    if (!mostRecentUserMessage) {
      return [];
    }
    return getFormattedBlocks(mostRecentUserMessage, null);
  }, [messages]);

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

  return (
    <>
      <div className="flex h-full overflow-hidden">
        <QuestNarrativeContainer>
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks}
              offerAudio={offerAudio}
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
                offerAudio={offerAudio}
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
