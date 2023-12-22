import { useQuery } from "@tanstack/react-query";
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
  enabled,
  onEmptyHistory = () => {},
}: {
  agentHandle: string;
  id: string;
  enabled: boolean;
  onEmptyHistory: () => void;
}): {
  blocks: Block[];
  isError: boolean;
  error: any;
  isLoading: boolean;
} {
  const { data, isLoading, isError, error } = useQuery({
    enabled: !!agentHandle && !!id && enabled,
    queryKey: ["chat-history", agentHandle, id],
    queryFn: async () => {
      if (!agentHandle) return;
      if (!id) return;

      const res = await fetch(`/api/agent/${agentHandle}/getChatHistory`, {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch chat history.`);
      }

      const blocksJson = await res.json();

      if (!blocksJson || !blocksJson.length) {
        onEmptyHistory();
      }

      return blocksJson;
    },
  });

  return {
    blocks: data || [],
    isLoading,
    isError,
    error,
  };
}
