import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";

export const useBlockStream = ({
  blockId,
  onFinish,
  maxRetries = 3, // maximum number of retries
  retryInterval = 2000, // time between retries in milliseconds
}: {
  blockId: string;
  onFinish?: (prompt: string, result: string) => void;
  maxRetries?: number;
  retryInterval?: number;
}) => {
  const [isError, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const api = `/api/block/${blockId}?retryCount=${retryCount}`;
  console.log(`api: ${api}`);
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
      console.log("reset retry count");
      setRetryCount(0); // reset retry count when blockId changes
      complete("");
    }
  }, [blockId]);

  // Optional: Effect to handle max retry limit reached
  useEffect(() => {
    if (retryCount >= maxRetries) {
      console.error(`Max retries reached for blockId ${blockId}`);
      setError(true);
      // Handle max retry limit reached scenario
    }
  }, [retryCount, maxRetries, blockId]);

  return { completion, isError };
};
