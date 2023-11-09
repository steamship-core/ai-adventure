"use client";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const OpenAIBanner = () => {
  const [isOpenOutage, setIsOpenOutage] = useState(false);
  const [isVisisble, setIsVisible] = useState(true);

  useEffect(() => {
    fetch("https://status.openai.com/api/v2/status.json")
      .then((res) => res.json())
      .then((res) => {
        setIsOpenOutage(res.status.indicator !== "none");
      });
  }, []);

  useEffect(() => {
    // Get the user's preference for hiding the banner from session storage
    const hideBanner = sessionStorage.getItem("hide-open-ai-banner");
    if (hideBanner) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const onClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hide-open-ai-banner", "true");
  };

  if (!isOpenOutage) {
    return null;
  }

  if (!isVisisble) {
    return null;
  }

  return (
    <div className="w-full">
      <Alert variant="warn" className="rounded-none py-2">
        <AlertTriangleIcon className="h-4 w-4 stroke-background" />
        <AlertTitle className="text-lg">ChatGPT Outage</AlertTitle>
        <AlertDescription>
          Open AI is reporting an outage of ChatGPT. This may affect your
          ability to play. Read more at{" "}
          <a
            href="https://status.openai.com/"
            target="_blank"
            className="text-blue-600"
          >
            https://status.openai.com/
          </a>
        </AlertDescription>
        <div className="absolute right-0 top-0 h-full">
          <div className="h-full flex px-2 items-center justify-center">
            <button className="" onClick={() => onClose()}>
              <XIcon />
            </button>
          </div>
        </div>
      </Alert>
    </div>
  );
};
