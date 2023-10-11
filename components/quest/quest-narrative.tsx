"use client";
import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import EndSheet from "./shared/end-sheet";
import { useId, useRef } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useChat } from "ai/react";
import { Message } from "ai";
import { useTypeWriter } from "../character-creation/hooks/use-typewriter";
import { Block, Tag } from "@steamship/client";
import { useParams } from "next/navigation";
import { TypographySmall } from "../ui/typography/TypographySmall";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const TextBlock = ({ text }: { text: string }) => {
  const { currentText, isFinished } = useTypeWriter({
    text: text.trim(),
    useMask: false,
  });
  return <p className="whitespace-pre-wrap">{currentText}</p>;
};

const getMessageType = (
  block: Block
): "status" | "chat:player" | "chat:other" => {
  if (block?.tags?.find((tag) => tag.kind === "status-message")) {
    return "status";
  }
  let roleTag: Tag | undefined = block?.tags?.find(
    (tag) => tag.kind === "chat" && tag.name == "role"
  );
  if ((roleTag?.value || {})["string-value"] == "user") {
    return "chat:player";
  }
  return "chat:other";
};

const getFormattedBlock = (message: Message) => {
  const blocks = message.content
    .split(/\r?\n|\r|\n/g)
    .map((block) => {
      return block ? (JSON.parse(block) as Block) : null;
    })
    .filter((block) => block) as Block[];

  const uniqueBlocks = blocks.reduce((acc, block) => {
    const existingBlock = acc.find((b) => b.id === block.id);
    if (!existingBlock) {
      acc.push(block);
    }
    return acc;
  }, [] as Block[]);
  return uniqueBlocks;
};

const DisplayBlock = ({ message }: { message: Message }) => {
  const id = useId();
  try {
    const blocks = getFormattedBlock(message);

    const textBlocks = blocks.filter((b) => getMessageType(b) === "chat:other");
    const concattenatedText = textBlocks.reduce((acc, block) => {
      if (block?.text) {
        acc = `${acc}\n\n${block.text}`;
      }
      return acc;
    }, "");

    return <TextBlock key={id} text={concattenatedText} />;
  } catch (e) {
    console.log(e);
    return <div>{message.content}</div>;
  }
};

const StatusMessage = ({ message }: { message: Message }) => {
  try {
    const blocks = getFormattedBlock(message);

    const statusBlocks = blocks.filter((b) => getMessageType(b) === "status");

    return statusBlocks.length > 0 ? (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 border rounded-md border-yellow-600 text-muted-foreground w-full">
            View Status Messages
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-8 w-full flex-col">
              {statusBlocks.map((block) => (
                <div key={block.id} className="px-4 py-2">
                  <TypographySmall>Status Message</TypographySmall>
                  <p>{block.text}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : null;
  } catch (e) {
    console.log(e);
    return <div>{message.content}</div>;
  }
};

const NarrativeBlock = ({ message }: { message: Message }) => {
  return (
    <>
      <StatusMessage message={message} />
      <DisplayBlock message={message} />
    </>
  );
};

export default function QuestNarrative() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { questId } = useParams();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ body: { context_id: questId } });
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
