"use client";

import { addFeedback, updateFeedback } from "@/app/actions/feedback";
import { cn } from "@/lib/utils";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { AutoResizeTextarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

export const FeedbackForm = ({ onComplete }: { onComplete: () => void }) => {
  const [isEnjoying, setIsEnjoying] = useState<boolean | undefined>();
  const [feedbackId, setFeedbackId] = useState<string | undefined>();
  const [feedbackString, setFeedbackString] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>();
  const [didComplete, setDidComplete] = useState<boolean | undefined>(false);
  const ref = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const createFeedback = async (
    isPositive: boolean | undefined,
    feedbackStr?: string
  ) => {
    if (isPositive === undefined) return;
    if (!feedbackId) {
      const feedback = await addFeedback({
        isPositive,
        feedback: feedbackStr,
        url: window.location.href,
      });
      setFeedbackId(feedback.id);
    } else {
      setIsLoading(true);
      await updateFeedback(feedbackId, {
        isPositive,
        feedback: feedbackStr,
        url: window.location.href,
      });
    }
    if (feedbackStr) {
      setIsLoading(false);
      onComplete();
      toast({
        title: "Feedback submitted",
        description: "Thanks for letting us know!",
        variant: "success",
        duration: 2000,
      });
      setDidComplete(true);
    }
  };

  const onSubmit: FormEventHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    await createFeedback(isEnjoying, feedbackString);
  };

  useEffect(() => {
    if (isEnjoying === undefined) return;
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isEnjoying]);

  return (
    <form className="flex flex-col gap-8 pt-4" onSubmit={onSubmit}>
      <div className={cn("flex flex-col gap-4")}>
        <div className="text-center">How has your experience been?</div>
        <div className="flex gap-2 w-full items-center justify-center">
          <Button
            type="button"
            className={cn(
              "text-4xl h-auto bg-green-300 hover:bg-green-500",
              isEnjoying === false && "opacity-20"
            )}
            disabled={didComplete}
            onClick={() => {
              setIsEnjoying(true);
              createFeedback(true);
            }}
          >
            😄
          </Button>
          <Button
            type="button"
            disabled={didComplete}
            className={cn(
              "text-4xl h-auto bg-red-300 hover:bg-red-500",
              isEnjoying === true && "opacity-20"
            )}
            onClick={() => {
              setIsEnjoying(false);
              createFeedback(false);
            }}
          >
            😐
          </Button>
        </div>
      </div>
      {isEnjoying !== undefined && (
        <div className={cn("flex flex-col gap-4")}>
          <div className="text-center">What else should we know?</div>
          <AutoResizeTextarea
            className="w-full"
            placeholder="Your feedback here"
            onChange={(e) => setFeedbackString(e.target.value)}
            value={feedbackString}
            autoFocus
            disabled={didComplete}
          />
          <Button ref={ref} disabled={isLoading || didComplete}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      )}
    </form>
  );
};
