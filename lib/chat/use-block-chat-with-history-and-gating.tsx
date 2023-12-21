import { UseChatHelpers } from "ai/react";
import { Block } from "../streaming-client/src/schema/block";
import { useBlockChatWithHistory } from "./use-block-chat-with-history";

/*
 * Wraps useBlockChatWithHistory with code that additionally
 *
 * - Adds a notion of currentBlock
 * - Adds in bits for acceptsContinue, acceptsMessage, isProcessing
 * - Adds in helpers for continue,
 *
 */
export function useBlockChatWithHistoryAndGating({
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
  blocks: Block[];
  visibleBlocks: Block[];
  nonVisibleBlocks: Block[];
  historyLoading: boolean;
  initialBlock: Block | null;
  currentBlock: Block | null;
  acceptsContinue: boolean;
  acceptsMessage: boolean;
  isProcessing: boolean;
} {
  const useBlockChatResp = useBlockChatWithHistory({
    agentBaseUrl,
    agentHandle,
    id,
    skipIfInputEquals,
    userKickoffMessageIfNewChat,
  });

  const isProcessing = false;
  const acceptsMessage = false;
  const acceptsContinue = false;
  const currentBlock = null;

  const initialBlock =
    useBlockChatResp.visibleBlocks.length > 0
      ? useBlockChatResp.visibleBlocks[0]
      : null;

  return {
    ...useBlockChatResp,
    initialBlock,
    isProcessing,
    acceptsMessage,
    acceptsContinue,
    currentBlock,
  };
}
