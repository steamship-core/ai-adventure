"use client";

import {
  recoilAudioActiveState,
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
import { ArrowDown, LoaderIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    const container = document.getElementById("narrative-container");
    container?.scrollTo({
      top: container.scrollHeight,
      behavior: "instant",
    });
  };

  return (
    <>
      <div ref={ref} className="w-full" />
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
    container?.scrollTo({
      top: container.scrollHeight,
      behavior: "instant",
    });
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
            setPriorBlocks(blocks.reverse());
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
  // TODO: Extend to work with dynamically generated blocks -- that will requireus to know the STEAMSHIP_API_BASE
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
    const updateGameState = async () => {
      const gs = await getGameState();
      setGameState(gs);
    };

    if (isComplete) {
      updateGameState();
    }
  }, [isComplete]);

  let nonPersistedUserInput: string | null = null;
  return (
    <>
      <div className="flex basis-11/12 overflow-hidden relative">
        <QuestNarrativeContainer>
          <ScrollButton />
          {messages
            .map((message) => {
              if (message.role === "user") {
                nonPersistedUserInput = message.content;
                return (
                  <UserInputBlock text={message.content} key={message.id} />
                );
              }
              return (
                <NarrativeBlock
                  key={message.id}
                  offerAudio={offerAudio}
                  blocks={getFormattedBlocks(message, nonPersistedUserInput)}
                  onSummary={onSummary}
                  onComplete={onComplete}
                />
              );
            })
            .reverse()}
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks.reverse()}
              offerAudio={offerAudio}
              onSummary={onSummary}
              onComplete={onComplete}
            />
          )}
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end justify-center flex-col w-full gap-2 basis-1/12 pt-1 relative">
        {isComplete ? (
          <EndSheet
            isEnd={true}
            summary={summary}
            completeButtonText={completeButtonText}
          />
        ) : (
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
              className={cn(inputClassNames, "w-full py-[.6rem] resize-none")}
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
        )}
      </div>
    </>
  );
}
