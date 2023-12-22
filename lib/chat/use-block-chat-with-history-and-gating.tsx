import { activeStreams } from "@/components/providers/recoil";
import { UseChatHelpers } from "ai/react";
import { useState } from "react";
import { useRecoilCounter } from "../recoil-utils";
import { MessageTypes } from "./block-chat-types";
import { ExtendedBlock } from "./extended-block";
import { useBlockChatWithHistory } from "./use-block-chat-with-history";

/*
 * useBlockChatWithHistoryAndGating wraps useBlockChatWithHistory with code that manages
 * the logic for a user interface layered atop a chat that commingles blocks of several types.
 *
 * The output blocks of this hook ARE NOT the entire chat history.
 * Rather, they are the output of the chat history which is appropriate for the current UI.
 *
 * Additionally, this hook adds the following properties to the output for UI management:
 *
 * - acceptsContinue - whether displaying a `continue` button is appropriate
 * - acceptsInput - whether displaying an `input` element is appropriate
 * - advance() - which advances the window of displayed blocks forward
 *
 * As well as others whose purpose can be inferred from variable names..
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
  showsContinue: boolean;
  acceptsContinue: boolean;
  acceptsInput: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  isFailed: boolean;
  isSucceeded: boolean;
  advance: () => void;
} {
  const useBlockChatResp = useBlockChatWithHistory({
    agentBaseUrl,
    agentHandle,
    id,
    skipIfInputEquals,
    userKickoffMessageIfNewChat,
  });

  const { blocks: allBlocks, visibleBlocks: allVisibleBlocks } =
    useBlockChatResp;

  /**
   * endIdx is the desired end index (0-indexed; exclusive) with respect to user input unfolding.
   * In practice this means VISIBLE BLOCKS. Each time it is incremented, a new BLOCK will be shown
   * if available. An endIdx of null is equivalent to an endIdx of Infinity.
   */
  const [endIdx, setEndIdx] = useState<number | null>(null); // End exclusive!

  const isProcessing = false;
  const currentBlock = null;

  /**
   * Advances the captured block window.
   * - In a chat, this is to the next object in the chat.
   * - In a comic book, this might be to the next scene.
   */
  const advance = (byAmount: number = 1) => {
    setEndIdx((priorVal) => {
      // If we already have a non-null endIdx, advance by `byAmount`
      if (priorVal != null) {
        console.log(
          `Advance narrative from endIdx ${priorVal} to ${priorVal + byAmount}.`
        );
        return priorVal + byAmount;
      }

      // If here, the prior val was null.
      const count = allVisibleBlocks?.length || 0;
      console.log(
        `Setting endIdx ${priorVal} to end+offset = ${count + byAmount}.`
      );
      return count + byAmount;
    });
  };

  /*
   * Here we calculate which blocks to return for the scene provided to the user.
   * For now, the startIdx is always 0, inclusive.
   * We push blocks onto the return object until we've reached the end of the blocks or the
   * endIdx, exclusive, of the visible blocks.
   */
  let _visibleBlocks: ExtendedBlock[] = [];
  let _nonVisibleBlocks: ExtendedBlock[] = [];
  let _blocks: ExtendedBlock[] = [];

  let isComplete = false;
  let isFailed = false;
  let isSucceeded = false;

  let _endIdx = endIdx || allVisibleBlocks?.length || 0;

  for (let block of allBlocks || []) {
    // Once the number of visible blocks has reached the endIdx if set, we stop.)
    if (_visibleBlocks.length >= _endIdx) {
      console.log(
        `Returning ${_visibleBlocks.length}/${allVisibleBlocks?.length} visible blocks (endIdx = ${_endIdx})`
      );
      break;
    }

    if (block.messageType == MessageTypes.QUEST_FAILED) {
      isComplete = true;
      isFailed = true;
    } else if (block.messageType == MessageTypes.QUEST_COMPLETE) {
      isComplete = true;
      isSucceeded = true;
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

  // Is the last visible block an input block?
  const lastVisibleBlockIsInput =
    _visibleBlocks &&
    _visibleBlocks.length > 0 &&
    _visibleBlocks[_visibleBlocks.length - 1].isInputElement;

  const moreVisibleBlocksToRender =
    _visibleBlocks?.length < (allVisibleBlocks?.length || 0);

  // We can send input the block window extends to the end of the available blocks.
  const acceptsInput =
    !moreVisibleBlocksToRender && !lastVisibleBlockIsInput && !isComplete;

  console.log(
    `moreVisibleBlocksToRender ${moreVisibleBlocksToRender}; lastVisibleBlockIsInput: ${lastVisibleBlockIsInput}; isComplete: ${isComplete} -> acceptsInput: ${acceptsInput}`
  );

  // Check if the last visible block is busy streaming content or blocking on user input.
  const { isStreaming } = useRecoilCounter(activeStreams);
  let lastActiveBlockIsBusy = false;
  if (
    _visibleBlocks &&
    _visibleBlocks.length > 0 &&
    isStreaming(_visibleBlocks[_visibleBlocks.length - 1].id)
  ) {
    lastActiveBlockIsBusy = true;
  }

  // We should offer a continue button if we're not waiting for input, we're not busy, and there's more to show
  const showsContinue =
    !acceptsInput && moreVisibleBlocksToRender && !isComplete;

  console.log(
    `acceptsInput: ${acceptsInput}; moreVisibleBlocksToRender: ${moreVisibleBlocksToRender}; isComplete: ${isComplete} ->  showsContinue: ${showsContinue}`
  );

  const acceptsContinue = showsContinue && !lastActiveBlockIsBusy;

  console.log(
    `showsContinue: ${showsContinue}; lastActiveBlockIsBusy: ${lastActiveBlockIsBusy}; ->  acceptsContinue: ${acceptsContinue}`
  );

  const ret = {
    ...useBlockChatResp,
    ..._outputWindow, // This overrides useBlockChatResp
    advance,
    isProcessing,
    acceptsInput,
    acceptsContinue,
    currentBlock,
    isComplete,
    showsContinue,
    isFailed,
    isSucceeded,
  };

  console.log("Output Window", _outputWindow);
  console.log("Visible inner", ret.visibleBlocks);
  return ret;
}
