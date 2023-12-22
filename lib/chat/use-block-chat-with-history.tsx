import { UseChatHelpers } from "ai/react";
import { useRef } from "react";
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
} {
  const initialized = useRef(false);

  const useBlockChatResp = useBlockChat({
    agentBaseUrl,
    id,
    skipIfInputEquals,
  });

  const historyEnabled = typeof useBlockChatResp?.append != "undefined";
  const onEmptyHistory = () => {
    if (userKickoffMessageIfNewChat && useBlockChatResp.append) {
      useBlockChatResp.append({
        id: "000-000-000",
        content: userKickoffMessageIfNewChat,
        role: "user",
      });
    }
  };

  let { blocks: history, isLoading: historyLoading } = useChatHistory({
    agentHandle,
    id,
    enabled: historyEnabled,
    onEmptyHistory: onEmptyHistory,
  });

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
  };
}
