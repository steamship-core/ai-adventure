import { activeStreams } from "@/components/providers/recoil";
import { UseChatHelpers } from "ai/react";
import { useEffect, useState } from "react";
import { useRecoilCounter } from "../recoil-utils";
import { ExtendedBlock } from "./extended-block";
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
  blocks: ExtendedBlock[];
  visibleBlocks: ExtendedBlock[];
  nonVisibleBlocks: ExtendedBlock[];
  historyLoading: boolean;
  initialBlock: ExtendedBlock | null;
  currentBlock: ExtendedBlock | null;
  acceptsContinue: boolean;
  acceptsInput: boolean;
  isProcessing: boolean;
  advance: () => void;
} {
  const useBlockChatResp = useBlockChatWithHistory({
    agentBaseUrl,
    agentHandle,
    id,
    skipIfInputEquals,
    userKickoffMessageIfNewChat,
  });

  const { blocks: allBlocks, historyLength } = useBlockChatResp;
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(historyLength); // End exclusive!

  console.log(startIdx, endIdx);

  useEffect(() => {
    // Note: if we get issues from this effect, we could plumb an onHistoryLoaded callback down.
    if (historyLength > 0 && endIdx == 0) {
      setEndIdx(historyLength);
    }
  }, [historyLength]);

  const isProcessing = false;
  const currentBlock = null;

  /**
   * Advances the to the next visible block.
   */

  const advance = () => {
    setEndIdx((priorVal) => {
      return priorVal + 1;
    });
  };

  // blocks: ExtendedBlock[];
  // visibleBlocks: ExtendedBlock[];
  // nonVisibleBlocks: ExtendedBlock[];

  const _blocks = allBlocks.slice(startIdx, endIdx);
  const _visibleBlocks = _blocks.filter((block: ExtendedBlock) => {
    return block.isVisibleInChat === true;
  });
  const _nonVisibleBlocks = _blocks.filter((block: ExtendedBlock) => {
    return !(block.isVisibleInChat === true);
  });
  const _outputWindow = {
    blocks: _blocks,
    visibleBlocks: _visibleBlocks,
    nonVisibleBlocks: _nonVisibleBlocks,
    initialBlock: _visibleBlocks.length > 0 ? _visibleBlocks[0] : null,
  };

  // We are allowed to continue if there are no active streams being played to the user.
  const { count: activeStreamCount } = useRecoilCounter(activeStreams);
  const acceptsContinue = activeStreamCount == 0;

  // We can send input the block window extends to the end of the available blocks.
  const acceptsInput = endIdx == allBlocks.length;

  const ret = {
    ...useBlockChatResp,
    ..._outputWindow, // This overrides useBlockChatResp
    advance,
    isProcessing,
    acceptsInput,
    acceptsContinue,
    currentBlock,
  };

  console.log("Output Window", _outputWindow);
  console.log("Visible inner", ret.visibleBlocks);
  return ret;
}
