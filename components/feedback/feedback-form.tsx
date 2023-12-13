"use client";

import { addFeedback, updateFeedback } from "@/app/actions/feedback";
import { cn } from "@/lib/utils";
import { PartyPopper } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { AutoResizeTextarea } from "../ui/textarea";

export const FeedbackForm = () => {
  const [isEnjoying, setIsEnjoying] = useState<boolean | undefined>();
  const [feedbackId, setFeedbackId] = useState<string | undefined>();
  const [feedbackString, setFeedbackString] = useState<string | undefined>();
  const [didSubmit, setDidSubmit] = useState<boolean | undefined>();

  const createFeedback = async (
    isPositive: boolean | undefined,
    feedbackStr?: string
  ) => {
    if (isPositive === undefined) return;
    if (!feedbackId) {
      const feedback = await addFeedback({
        isPositive,
        feedback: feedbackStr,
      });
      setFeedbackId(feedback.id);
    } else {
      await updateFeedback(feedbackId, {
        isPositive,
        feedback: feedbackStr,
      });
    }
    if (feedbackStr) {
      setDidSubmit(true);
    }
  };

  const onSubmit: FormEventHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    await createFeedback(isEnjoying, feedbackString);
  };

  return (
    <form className="flex flex-col gap-8 pt-4" onSubmit={onSubmit}>
      <div className={cn("flex flex-col gap-4", didSubmit && "opacity-20")}>
        <div className="text-center">How has your experience been?</div>
        <div className="flex gap-2 w-full items-center justify-center">
          <Button
            type="button"
            disabled={didSubmit}
            className={cn(
              "text-4xl h-auto bg-green-300 hover:bg-green-500",
              isEnjoying === false && "opacity-20"
            )}
            onClick={() => {
              setIsEnjoying(true);
              createFeedback(true);
            }}
          >
            😄
          </Button>
          <Button
            type="button"
            disabled={didSubmit}
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
        <div className={cn("flex flex-col gap-4", didSubmit && "opacity-20")}>
          <div className="text-center">What else should we know?</div>
          <AutoResizeTextarea
            disabled={didSubmit}
            className="w-full"
            placeholder="Your feedback here"
            onChange={(e) => setFeedbackString(e.target.value)}
            value={feedbackString}
          />
          <Button disabled={didSubmit}>Submit</Button>
        </div>
      )}
      {didSubmit && (
        <Alert>
          <PartyPopper className="h-4 w-4" />
          <AlertTitle>Thank you!</AlertTitle>
          <AlertDescription>
            We really appreciate it. Join our{" "}
            <a href="https://steamship.com/discord" className="text-blue-500">
              Discord
            </a>{" "}
            to chat with the devs directly and follow along with updates.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};
