"use client";

import {
  recoilBlockHistory,
  recoilContinuationState,
  recoilGameState,
} from "@/components/providers/recoil";
import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { amplitude } from "@/lib/amplitude";
import {
  MessageTypes,
  getMessageType,
  validTypes,
} from "@/lib/chat/block-chat-types";
import { chatMessageJsonlToBlocks } from "@/lib/chat/parse-blocks-from-message";
import { useBlockChat } from "@/lib/chat/use-block-chat";
import { getGameState } from "@/lib/game/game-state.client";
import { useBackgroundMusic } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { ArrowDown, ArrowRightIcon, LoaderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button } from "../../ui/button";
import EndSheet from "../shared/end-sheet";
import InteractionBox from "./interaction-box";
import { NarrativeBlock } from "./narrative-block";
import SelectedTextOverlay from "./selected-text-overlay";
import { UserInputBlock } from "./user-input-block";

import { ExtendedBlock } from "@/lib/chat/extended-block";

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

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
  agentBaseUrl,
  completeButtonText,
  priorBlocks,
  agentHandle,
  adventureId,
  didFail,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: (failed?: boolean) => void;
  isComplete: boolean;
  agentBaseUrl: string;
  completeButtonText?: string;
  priorBlocks?: ExtendedBlock[];
  agentHandle?: string;
  adventureId?: string;
  didFail?: boolean;
}) {
  const initialized = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const params = useParams<{ handle: string }>();
  const { setUrl: setBackgroundMusicUrl } = useBackgroundMusic();
  const [gg, setGameState] = useRecoilState(recoilGameState);
  const isContinuationEnabled = useRecoilValue(recoilContinuationState);
  const router = useRouter();

  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    error,
    blocks: formattedBlocks,
  } = useBlockChat({
    id: id,
    agentBaseUrl,
  });

  const scrollToBottom = () => {
    const container = document.getElementById("narrative-container");
    if (container) {
      container.scrollTop = container?.scrollHeight;
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!priorBlocks || priorBlocks.length === 0) {
      append({
        id: "000-000-000",
        content: "Let's go on an adventure!",
        role: "user",
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
    console.log("useEffect messages", messages);
    scrollToBottom();
  }, [formattedBlocks]);

  useEffect(() => {
    const updateGameState = async () => {
      const gs = await getGameState(params.handle);
      setGameState(gs);
    };

    if (isComplete) {
      updateGameState();
    }
  }, [isComplete]);

  // const formattedBlocks: Block[] = useMemo(() => {
  //   console.log("got back messages", messages);
  //   console.log("messages length", messages?.length);

  //   const mostRecentMessage =
  //     messages.length > 0 ? messages[messages.length - 1] : null;
  //   if (!mostRecentMessage) {
  //     return [];
  //   }
  //   return chatMessageJsonlToBlocks(mostRecentMessage, null);
  // }, [messages]);

  // const { blocks: formattedBlocks } = useBlockChat();

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

  const offerUserInteraction: boolean = !nextBlock;

  return (
    <>
      <div className="flex h-full overflow-hidden">
        <div
          className="absolute left-1/2 right-0 bottom-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            className="aspect-[801/1036] w-[55.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
          />
        </div>
        <QuestNarrativeContainer>
          <SelectedTextOverlay
            divId="quest-narrative-container"
            adventureId={adventureId!}
          />

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
                blocks={chatMessageJsonlToBlocks(
                  message,
                  nonPersistedUserInput
                )}
                onSummary={onSummary}
                onComplete={onComplete}
                orderedBlocks={orderedBlocks}
              />
            );
          })}
          {messages.length > 1 &&
            messages[messages.length - 1].role === "user" && (
              <LoaderIcon className="animate-spin" />
            )}
          <ScrollButton />
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end justify-center flex-col w-full gap-2 h-20 mb-2 pt-1 relative">
        {isComplete && !nextBlock ? (
          <EndSheet
            isEnd={true}
            summary={summary}
            completeButtonText={completeButtonText}
            didFail={didFail}
          />
        ) : (
          <>
            {offerUserInteraction ? (
              <InteractionBox
                formRef={formRef}
                inputRef={inputRef}
                handleSubmit={handleSubmit}
                scrollToBottom={scrollToBottom}
                input={input}
                handleInputChange={handleInputChange}
                isLoading={isLoading}
                isComplete={isComplete}
                setInput={setInput}
                agentHandle={agentHandle}
              />
            ) : (
              <Button
                disabled={!isContinuationEnabled}
                onClick={() => {
                  amplitude.track("Button Click", {
                    buttonName: "Continue",
                    location: "Quest",
                    action: "continue-quest",
                    questId: id,
                    workspaceHandle: params.handle,
                  });
                  if (initialBlock?.id) {
                    const containsInitialBlock = chatHistory.includes(
                      initialBlock?.id
                    );
                    if (!containsInitialBlock) {
                      setChatHistory((prev) => [
                        ...prev,
                        initialBlock.id,
                        nextBlock!.id,
                      ]);
                    } else {
                      setChatHistory((prev) => [...prev, nextBlock!.id]);
                    }
                  } else {
                    setChatHistory((prev) => [...prev, nextBlock!.id]);
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
