import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";

export const useBlockStream = ({
  blockId,
  onFinish,
  maxRetries = 3,
  retryInterval = 2000,
}: {
  blockId: string;
  onFinish?: (prompt: string, result: string) => void;
  maxRetries?: number;
  retryInterval?: number;
}) => {
  const [isError, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const api = `/api/block/${blockId}?retryCount=${retryCount}`;

  const { completion, complete } = useCompletion({
    api,
    onFinish,
    onError(error) {
      console.error(error);
      handleRetry();
    },
  });

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
        complete("");
      }, retryInterval);
    }
  };

  useEffect(() => {
    if (blockId) {
      setRetryCount(0);
      complete("");
    }
  }, [blockId]);

  useEffect(() => {
    if (retryCount >= maxRetries) {
      console.error(`Max retries reached for blockId ${blockId}`);
      setError(true);
    }
  }, [retryCount, maxRetries, blockId]);

  return { completion, isError };
};
