"use client";

import ErrorBoundary from "@/components/error-boundary";
import { QuestNarrativeContainer } from "@/components/quest/components";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyP } from "@/components/ui/typography/TypographyP";
import { amplitude } from "@/lib/amplitude";
import { MessageTypes } from "@/lib/chat/block-chat-types";
import { ExtendedBlock } from "@/lib/chat/extended-block";
import { useBlockChatWithHistoryAndGating } from "@/lib/chat/use-block-chat-with-history-and-gating";
import { useBackgroundMusic } from "@/lib/hooks";
import { useGameState } from "@/lib/recoil-utils";
import { Block } from "@/lib/streaming-client/src";
import { ArrowDown, ArrowRightIcon, LoaderIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import EndSheet from "../quest/end-sheet";
import { Button } from "../ui/button";
import InteractionBox from "./interaction-box";
import { NarrativeBlock } from "./narrative-block";
import SelectedTextOverlay from "./selected-text-overlay";

/**
 * TODO(eventual) -- This is very close to being a generic chat that could be used for
 * NPCs, etc. Possibilities to explore that integration appear to be:
 *
 * - Make the EndSheet something that's passed in from the caller
 * - Make the notion of id & questId something that's more easily portable (outerContext, innerContext?)
 *
 * Further possibilities:
 *
 * - Have a standard <OutputBlock> interface (props, etc)
 * - Have a standard <InputWidget> interface (text, options, dice roll)
 * - Have a standard <WorldModifier> interface (weather, etc) which might also work with a map-view (??)
 *
 * Such that we can more easily
 */

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

/**
 * A note on IDs:
 *
 * The `questId` is NOT the ChatHistory ID. It is a marker WITHIN the chat history that is used
 * to filter to a sub-section of the ChatHistory.
 *
 * If we were to implement a system in which we managed multiple ChatHistory files at this level,
 * we would need to introduce a different ID here that designated that.
 *
 * - adventureId is the ID of the Adventure (Game) being played.
 * - agentHandle is the ID of the instance of the Adventure (Game)
 * - agentBaseUrl is the URL of the agent directly, and should probably be removed from this component.
 *
 * Ideally the information hierarchy passed here is:
 * Adventure ID -> Instance ID -> [ n/a Chat ID ] -> Quest ID
 *
 * @returns
 */
export default function Chat({
  questId,
  agentBaseUrl,
  agentHandle,
  adventureId,
}: {
  questId: string;
  agentBaseUrl: string;
  agentHandle: string;
  adventureId?: string;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const params = useParams<{ handle: string }>();
  const { setUrl: setBackgroundMusicUrl } = useBackgroundMusic();
  const { gameState, refreshGameState } = useGameState(params.handle);

  const router = useRouter();

  /**
   * On IDs and QuestIDs
   * The ID here is
   */

  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    error,
    blocks,
    visibleBlocks,
    advance,
    showsContinue,
    acceptsInput,
    acceptsContinue,
    isComplete: isCompleteFromStream,
    isFailed,
    isSucceeded,
    nonVisibleBlocks,
  } = useBlockChatWithHistoryAndGating({
    id: questId,
    agentBaseUrl,
    agentHandle,
    // skipIfInputEquals = null,
    userKickoffMessageIfNewChat: "Let's go on an adventure!",
  });

  /**
   * This is a helper to scroll the chat to the bottom of the page
   */
  const scrollToBottom = () => {
    const container = document.getElementById("narrative-container");
    if (container) {
      container.scrollTop = container?.scrollHeight;
    }
  };

  // This is the handler for blocks we should react to
  const onBlock = (block: ExtendedBlock) => {
    if (block.messageType === MessageTypes.SCENE_AUDIO) {
      if (setBackgroundMusicUrl) {
        var streamingUrl = (block as any).streamingUrl;
        if (streamingUrl) {
          setBackgroundMusicUrl(streamingUrl);
        }
      }
    }
  };

  // Scroll to the bottom whenever the blocks change.
  useEffect(() => {
    scrollToBottom();
  }, [visibleBlocks]);

  // Call the onBLock handler for each block, each time the blocks change.
  // TODO: We should only ever call the onBlock handler once per block -- need to memoize.
  useEffect(() => {
    for (let block of blocks) {
      onBlock(block);
    }
  }, [blocks]);

  // If we're complete, we should refresh the game state
  useEffect(() => {
    if (isCompleteFromStream) {
      refreshGameState();
    }
  }, [isCompleteFromStream]);

  // Important! When we RELOAD the, the QuestEnded block might not be present since agent versions in 2023
  // didn't mark that with the quest ID. That means loading the historical quest blocks will miss them.
  // So we need to combine the state from the quest stream with some markers on game_state which will help
  // us identify that the quest, in fact, is complete.
  const quest = gameState?.quests?.find((q) => q.name === questId);
  const questHasSummary = quest?.text_summary ? true : false;

  // This is the hack to make sure we realize the quest is complete from the GameState when historical reload
  // of the quest blocks doesn't have the QuestEnded block.
  const isComplete = isCompleteFromStream || questHasSummary;
  const completeButtonText = questHasSummary
    ? "See Quest Results"
    : "Complete Quest";

  // TODO: we also need to figure out how to historically determine success/failure.

  const _showsContinue = !isComplete && showsContinue;
  const _acceptsInput = !isComplete && acceptsInput;

  if (error) {
    return (
      <div className="flex h-full overflow-hidden items-center justify-center flex-col text-center">
        <TypographyH3>An unexpected error occurred</TypographyH3>
        <TypographyP>
          We encountered an error while attempting to load this chat session.
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
          {visibleBlocks.map((block, idx) => {
            return (
              <ErrorBoundary key={block.id}>
                <NarrativeBlock
                  block={block}
                  offerAudio
                  isFirst={idx === 0}
                  isPrior={block.historical ? true : undefined}
                  advance={advance}
                />
              </ErrorBoundary>
            );
          })}

          {/* 
          TODO: Are we missing the echo back of the user input?
          
          {messages.map((message) => {
            if (message.role === "user") {
              nonPersistedUserInput = message.content;
              return <UserInputBlock text={message.content} key={message.id} />;
            }
          })} */}
          {messages.length > 1 &&
            messages[messages.length - 1].role === "user" && (
              <LoaderIcon className="animate-spin" />
            )}
          <ScrollButton />
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end justify-center flex-col w-full gap-2 h-20 mb-2 pt-1 relative">
        {isComplete && (
          <EndSheet
            isEnd={true}
            summary={
              {
                text: quest?.text_summary || "",
              } as Block
            }
            completeButtonText={completeButtonText}
            didFail={isFailed}
          />
        )}
        {_acceptsInput && (
          <InteractionBox
            formRef={formRef}
            inputRef={inputRef}
            handleSubmit={(e) => {
              advance();
              handleSubmit(e);
            }}
            scrollToBottom={scrollToBottom}
            input={input}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            setInput={setInput}
            agentHandle={agentHandle}
          />
        )}
        {_showsContinue && (
          <Button
            disabled={!acceptsContinue}
            onClick={() => {
              amplitude.track("Button Click", {
                buttonName: "Continue",
                location: "Quest",
                action: "continue-quest",
                questId: questId,
                workspaceHandle: params.handle,
              });
              advance();
              setTimeout(() => {
                scrollToBottom();
              }, 150);
            }}
            className="w-full"
          >
            Continue <ArrowRightIcon size={18} />
          </Button>
        )}
      </div>
    </>
  );
}
