"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recoilErrorModalState } from "../providers/recoil";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyP } from "../ui/typography/TypographyP";

const GeneratingView = ({
  isGeneratingTaskId,
  stateUpdatedAt,
  adventureId,
}: {
  adventureId: string;
  isGeneratingTaskId?: string | null;
  stateUpdatedAt?: Date | null;
}) => {
  const [_, setError] = useRecoilState(recoilErrorModalState);
  const [state, setState] = useState();
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const refreshState = async () => {
    const response = await fetch(`/api/adventure/${adventureId}`, {
      method: "POST",
      body: JSON.stringify({
        operation: "sync-state",
        id: adventureId,
      }),
    });

    if (!response.ok) {
      const e = {
        title: "Failed to check the state of your adventure.",
        message: "The server responded with an error response",
        details: `Status: ${response.status}, StatusText: ${
          response.statusText
        }, Body: ${await response.text()}`,
      };
      setError(e);
      console.error(e);
    } else {
      const newAgent = await response.json();
      if (newAgent?.state == "ready") {
        setReady(true);
        setTimeout(() => {
          router.push(`/adventures/editor/${adventureId}`);
        }, 1000);
      } else {
        setTimeout(() => {
          refreshState();
        }, 4000);
      }
    }
  };

  useEffect(() => {
    if (stateUpdatedAt == null) {
      refreshState();
    } else {
      const diffMs = new Date().getTime() - stateUpdatedAt.getTime();
      const diffS = diffMs / 1000;
      if (diffS > 60 * 4) {
        setError({
          title: "Magic Mode timed out.",
          details:
            "Sometimes this happens when an image takes longer than expected to generate. Try again in a few minutes.",
        });
      } else {
        refreshState();
      }
    }
  }, [stateUpdatedAt]);

  return (
    <>
      {false ? (
        <div className="flex items-center justify-center h-full flex-col gap-8">
          <TypographyH3>Magic has occurred!</TypographyH3>
          <TypographyP>
            Redirecting you.. explore your new adventure!
          </TypographyP>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full flex-col gap-8">
          <Player
            autoplay
            loop
            src="/magic-lottie.json"
            className="w-64 h-64 rounded-full"
          />
          <TypographyH3>Using AI magic to build an adventure</TypographyH3>
        </div>
      )}
    </>
  );
};

export default GeneratingView;
