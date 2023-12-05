"use client";

import { CustomTooltip } from "@/components/camp/welcome-modal";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });
// @ts-ignore
const joyrideSteps: StepProps = [
  {
    target: "#publish-section",
    placement: "bottom",
    title: "Test & Publsh",
    content: (
      <>
        <TypographyMuted className="text-base text-muted-foreground">
          Click <b> Test</b> to demo your adventure before publishing changes.
          You can then <b>Publish</b> your changes and make them live. After
          publishing, you can share your adventure with friends!
        </TypographyMuted>
      </>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#editor-side-nav",
    placement: "right-start",
    title: "Editor Navigation",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Adventures are highly customizable. Use the navigation on the left to
        edit all aspects of your adventure. As a good next step, check out the{" "}
        <b>Story</b> and <b>Character</b> tabs.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#description",
    placement: "top",
    title: "Auto Generated Description",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Based on your adventure settings, we&apos;ve generated a description for
        your adventure. You can edit this description, or write your own.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: "#image",
    placement: "top",
    title: "Auto Generated Image",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        We also generated an image for your adventure. You can edit this image,
        or upload your own.
      </TypographyMuted>
    ),
    disableBeacon: true,
  },

  {
    target: "body",
    placement: "center",
    title: "Start Building!",
    content: (
      <TypographyMuted className="text-base text-muted-foreground">
        Congrats! You can either continue exploring the editor, or return to the
        adventure page and start playing.
      </TypographyMuted>
    ),
    disableBeacon: true,
    disableScrolling: true,
  },
];
const EditorTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const queryParams = useSearchParams();
  const initializationSuccess = queryParams.get("initializationSuccess");

  useEffect(() => {
    // get if the yser has seen the tutorial from local storage
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    // if the user has not seen the tutorial, show it
    if (!hasSeenTutorial && initializationSuccess) {
      setShowTutorial(true);
    }
  }, []);

  const onComplete = () => {
    localStorage.setItem("hasSeenTutorial", "true");
  };
  return (
    <Joyride
      run={showTutorial}
      // @ts-ignore
      steps={joyrideSteps}
      continuous
      showProgress
      hideCloseButton
      tooltipComponent={CustomTooltip}
      disableOverlayClose
      disableCloseOnEsc
      styles={{
        // @ts-ignore
        options: {
          arrowColor: "hsl(var(--foreground))",
        },
      }}
      callback={(data: any) => {
        if (
          data.lifecycle === "complete" &&
          data.index === 2 &&
          data.action === "next"
        ) {
          onComplete();
        }
      }}
    />
  );
};

export default EditorTutorial;
