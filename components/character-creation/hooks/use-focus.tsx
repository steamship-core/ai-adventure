import { useEffect, useRef, useState } from "react";

const useFocus = <T extends HTMLTextAreaElement | HTMLInputElement>(
  isFinished: boolean,
  isCurrent: boolean
) => {
  const [didFocus, setDidFocus] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (isFinished && !didFocus) {
      ref.current?.focus();
      setDidFocus(true);
    }
  }, [didFocus, isFinished]);

  useEffect(() => {
    if (isCurrent) {
      ref.current?.focus();
    }
  }, [isCurrent]);

  return { ref };
};

export default useFocus;
