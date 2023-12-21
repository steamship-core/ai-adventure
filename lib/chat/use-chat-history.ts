import { useEffect, useState } from "react";
import { Block } from "../streaming-client/src/schema/block";

/*
 * Wraps useBlockChat with code that additionally loads in the existing chat history
 * for a conversation.
 *
 * This provides handling for both "the conversation already had" and also "the conversation evolving in realtime"
 *
 */
export function useChatHistory({
  agentHandle,
  id,
}: {
  agentHandle: string;
  id: string;
}): { blocks: Block[]; loading: boolean } {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChatHistory = async (handle: string, id: string) => {
    const resp = await fetch(`/api/agent/${handle}/getChatHistory`, {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    });

    if (!resp.ok) {
      setBlocks([]);
    }

    const blocksJson = await resp.json();
    console.log("Got chatHistory", blocksJson);
    setBlocks(blocksJson);
    setLoading(false);
  };

  useEffect(() => {
    if (id && agentHandle) {
      fetchChatHistory(agentHandle, id);
    } else {
      setBlocks([]);
    }
  }, [id, agentHandle]);

  return { blocks, loading };
}
