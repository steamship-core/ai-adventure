import { useEffect } from "react";

import { useCompletion } from "ai/react";

export const useBlockStream = ({
  blockId,
  onFinish,
}: {
  blockId: string;
  onFinish?: (prompt: string, result: string) => void;
}) => {
  const { completion, complete } = useCompletion({
    api: `/api/block/${blockId}`,
    onFinish,
  });

  useEffect(() => {
    if (blockId) {
      const {} = complete("");
    }
  }, [blockId]);

  return completion;
};
