import { UseChatHelpers } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { ExtendedBlock } from "./extended-block";
import { useBlockChat } from "./use-block-chat";
import { useChatHistory } from "./use-chat-history";

/*
 * Wraps useBlockChat with code that additionally loads in the existing chat history
 * for a conversation.
 *
 * This provides handling for both "the conversation already had" and also "the conversation evolving in realtime"
 *
 */
export function useBlockChatWithHistory({
  agentBaseUrl,
  agentHandle,
  id,
  skipIfInputEquals = null,
  userKickoffMessageIfNewChat = null,
}: {
  agentBaseUrl: string;
  agentHandle: string;
  id: string;
  skipIfInputEquals?: string | null;
  userKickoffMessageIfNewChat: string | null;
}): UseChatHelpers & {
  blocks: ExtendedBlock[];
  visibleBlocks: ExtendedBlock[];
  nonVisibleBlocks: ExtendedBlock[];
  historyLoading: boolean;
  historyLength: number;
} {
  const initialized = useRef(false);

  const [historyLength, setHistoryLength] = useState(0);

  let { blocks: history, loading: historyLoading } = useChatHistory({
    agentHandle,
    id,
  });

  const useBlockChatResp = useBlockChat({
    agentBaseUrl,
    id,
    skipIfInputEquals,
  });

  /**
   * This effect is meant to trigger an initial "Let's go on an adventure"
   * message from the user. This is only triggered if:
   *
   * - We have loaded the history, and
   * - We find that nothing has yet been appended to it
   */
  useEffect(() => {
    // TODO(ted): Move this logic into the useChatHistory HTTP response function.
    // Plumb down an onHistoryEmpty method
    // Then the very-top-level component is the thing that will send the message.

    // If no kickoff message, return.
    if (!userKickoffMessageIfNewChat) return;

    // If we haven't loaded the history, we shouldn't append an initial bock
    if (historyLoading) return;

    // If we've already initialized, return.
    if (initialized.current) return;
    initialized.current = true;

    const isCompletelyNewChat = !history || history.length === 0;

    setHistoryLength(history?.length || 0);

    if (isCompletelyNewChat) {
      // Kick off the initial part of the conversation!
      useBlockChatResp.append({
        id: "000-000-000",
        content: userKickoffMessageIfNewChat,
        role: "user",
      });
    }
  }, [historyLoading, history, userKickoffMessageIfNewChat]);

  let allBlocks = [...history, ...useBlockChatResp.blocks];

  const visibleBlocks = allBlocks.filter((block: ExtendedBlock) => {
    return block.isVisibleInChat === true;
  });

  const nonVisibleBlocks = allBlocks.filter((block: ExtendedBlock) => {
    return !(block.isVisibleInChat === true);
  });

  return {
    ...useBlockChatResp,
    blocks: allBlocks,
    visibleBlocks,
    nonVisibleBlocks,
    historyLoading,
    historyLength,
  };
}
