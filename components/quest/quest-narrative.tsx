"use client";
import {
  QuestContainer,
  QuestContentContainer,
  QuestNarrativeContainer,
} from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "./shared/end-sheet";
import { Fragment, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { useChat, useCompletion } from "ai/react";
import { Message } from "ai";
import { useTypeWriter } from "../character-creation/hooks/use-typewriter";
import { Block } from "@steamship/client";

const TextBlock = ({ block }: { block: Block }) => {
  const { currentText, isFinished } = useTypeWriter({
    text: block.text!,
  });
  return <div>{currentText}</div>;
};

const NarrativeBlock = ({ message }: { message: Message }) => {
  try {
    console.log(message.content.split(/\r?\n|\r|\n/g));
    const block = JSON.parse(
      message.content.split(/\r?\n|\r|\n/g).join(",")
    ) as Block;
    console.log(block);
    return <TextBlock block={block} />;
  } catch (e) {
    console.log(e);
    return <div>{message.content}</div>;
  }
};

export default function QuestNarrative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  console.log(messages);
  return (
    <>
      <div className="flex basis-10/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages
            .map((message, i) => {
              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="px-4 py-2 border-l-2 border-foreground/20 text-muted-foreground"
                  >
                    {message.content}
                  </div>
                );
              }
              return <NarrativeBlock key={message.id} message={message} />;
            })
            .reverse()}
        </QuestNarrativeContainer>
      </div>
      <div className="flex flex-col gap-2 basis-1/12">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputRef?.current?.focus();
            handleSubmit(e);
          }}
        >
          <Input
            className="w-full"
            value={input}
            onChange={handleInputChange}
            ref={inputRef}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <SendIcon size={16} />
          </Button>
        </form>
        <EndSheet isEnd={false} />
      </div>
    </>
  );
}

/*
* Existing chat widget
* When encountering a new block, may be a chat block or may not be
* Need a getBlockType helper to look through all tags and determine block

Block Types
* new background
* background audio
* narration (of a text block you already have!)
* character image
* Anything else, if it’s role assistant should be shown as text
*/
