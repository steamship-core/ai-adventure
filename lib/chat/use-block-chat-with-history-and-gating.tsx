import { activeStreams } from "@/components/providers/recoil";
import { UseChatHelpers } from "ai/react";
import { useState } from "react";
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

  const { blocks: allBlocks } = useBlockChatResp;

  // These are the indices of the VISIBLE BLOCKS!!! Not all blocks
  const [endIdx, setEndIdx] = useState<number | null>(null); // End exclusive!

  const isProcessing = false;
  const currentBlock = null;

  const getVisibleBlockCount = () => {
    if (!allBlocks || !allBlocks.length) {
      return null;
    }
    var count = 0;
    for (const block of allBlocks) {
      if (block.isVisibleInChat) {
        count++;
      }
    }
    return count;
  };

  /**
   * Advances the captured block window.
   * - In a chat, this is to the next object in the chat.
   * - In a comic book, this might be to the next scene.
   */
  const advance = () => {
    setEndIdx((priorVal) => {
      if (priorVal != null) {
        return priorVal + 1;
      }
      // We initialize to the number of visible blocks + 1 since it's end exclusive.
      const count = getVisibleBlockCount();
      if (count != null) {
        return count + 1;
      }
      return null;
    });
  };

  let _visibleBlocks: ExtendedBlock[] = [];
  let _nonVisibleBlocks: ExtendedBlock[] = [];
  let _blocks: ExtendedBlock[] = [];

  for (let block of allBlocks || []) {
    // Once the number of visible blocks has reached the endIdx if set, we stop.)
    if (endIdx != null && _visibleBlocks.length <= endIdx) {
      break;
    }

    _blocks.push(block);
    if (block.isVisibleInChat) {
      _visibleBlocks.push(block);
    } else {
      _nonVisibleBlocks.push(block);
    }
  }

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
