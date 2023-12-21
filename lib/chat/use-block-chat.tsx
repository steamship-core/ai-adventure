import { Message, UseChatHelpers, useChat } from "ai/react";
import { useMemo } from "react";
import { Block } from "../streaming-client/src/schema/block";
import { chatMessagesJsonlToBlocks } from "./parse-blocks-from-message";

/*
 * Adapts a useChat stream that contains a list of Message objects into a an extended response type that
 * includes the list of Block objects within the messages.
 *
 * Each message is assumed to be an event stream of Block objects.
 *
 * The resulting useBlockChat object can be used in the same way as useChat, but the `blocks` property
 * of the return type will contain the list of blocks within.
 */
export function useBlockChat({
  agentBaseUrl,
  id,
  skipIfInputEquals = null,
}: {
  agentBaseUrl: string;
  id: string;
  skipIfInputEquals?: string | null;
}): UseChatHelpers & { blocks: Block[] } {
  const useChatResp = useChat({
    onFinish: (message: Message) => {
      console.log(`onChat call finished`, message);
    },
    onError: (error: Error) => {
      console.log(`onChat call errored`, error);
    },
    body: {
      context_id: id,
      agentBaseUrl,
    },
    id,
  });

  const { messages } = useChatResp;

  const blocks = useMemo(() => {
    const _blocks = chatMessagesJsonlToBlocks(messages, skipIfInputEquals);
    console.log("Blocks Updated", _blocks);
    return _blocks;
  }, [messages, skipIfInputEquals]);

  return {
    blocks,
    ...useChatResp,
  };
}
