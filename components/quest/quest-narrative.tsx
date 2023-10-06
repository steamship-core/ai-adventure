"use client";
import {
  QuestContainer,
  QuestContentContainer,
  QuestNarrativeContainer,
} from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "./shared/end-sheet";
import { useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { TypographyP } from "../ui/typography/TypographyP";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

const EXAMPLE_QUEST = [
  {
    type: "narration",
    content:
      "You are in a forest. There is a path to the left and a path to the right. Which way do you go?",
  },
  {
    type: "image",
    content: "/forest.png",
  },
  {
    type: "narration",
    content:
      "You go left. You see a bear - and it looks hungry. The bear turns to you and roars. What do you do?",
  },
  {
    type: "narration",
    content:
      "You run away from the bear. You find a cave. You go inside. You find a dragon. What do you do?",
  },
  {
    type: "narration",
    content:
      "You fight the dragon. You defeat the dragon. You save the princess. You win!",
  },
] as const;

export default function QuestNarrative() {
  const [messages, setMessages] = useState<
    { type: "narration" | "user" | "image"; content: string }[]
  >([EXAMPLE_QUEST[1], EXAMPLE_QUEST[0]]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(2);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex basis-10/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages.map((m) => {
            if (m.type === "narration") {
              return (
                <TypographyP key={m.content} className="!mt-0">
                  {m.content}
                </TypographyP>
              );
            }
            if (m.type === "image") {
              return (
                <div key={m.content} className="mx-28 md:mx-44">
                  <div className="w-full aspect-square relative overflow-hidden rounded-md">
                    <Image
                      src={m.content}
                      alt="Generated scene"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            }
            if (m.type === "user") {
              return (
                <div
                  key={m.content}
                  className="rounded-md p-4 border border-foreground/10"
                >
                  <TypographyMuted>{m.content}</TypographyMuted>
                </div>
              );
            }
          })}
        </QuestNarrativeContainer>
      </div>
      <div className="flex flex-col gap-2 basis-1/12">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Update this to detecte if we are beyond the final message
            if (currentMessageIndex >= EXAMPLE_QUEST.length) return;
            // Only refocus if we are not the final message
            // TODO: Update this to detect if we are on the final message
            if (currentMessageIndex !== EXAMPLE_QUEST.length - 1) {
              inputRef?.current?.focus();
            }
            setMessages((prev) => [
              EXAMPLE_QUEST[currentMessageIndex],
              { type: "user", content: message },
              ...prev,
            ]);
            setMessage("");
            setCurrentMessageIndex((prev) => prev + 1);
          }}
        >
          <Input
            className="w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={currentMessageIndex >= EXAMPLE_QUEST.length}
            ref={inputRef}
          />
          <Button
            type="submit"
            disabled={currentMessageIndex >= EXAMPLE_QUEST.length}
          >
            <SendIcon size={16} />
          </Button>
        </form>
        <EndSheet isEnd={currentMessageIndex >= EXAMPLE_QUEST.length} />
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
