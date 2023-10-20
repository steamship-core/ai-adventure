"use client";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const OpenAIBanner = () => {
  const [isOpenOutage, setIsOpenOutage] = useState(false);

  useEffect(() => {
    fetch("https://status.openai.com/api/v2/status.json")
      .then((res) => res.json())
      .then((res) => {
        setIsOpenOutage(res.status.indicator !== "none");
      });
  }, []);

  if (!isOpenOutage) {
    return null;
  }

  return (
    <div className="w-full">
      <Alert variant="warn" className="rounded-none py-2">
        <AlertTriangleIcon className="h-4 w-4 stroke-background" />
        <AlertTitle className="text-lg">Open AI Outage</AlertTitle>
        <AlertDescription>
          Open AI is reporting an outage. This may affect your ability to play.
          Read more at{" "}
          <a
            href="https://status.openai.com/"
            target="_blank"
            className="text-blue-600"
          >
            https://status.openai.com/
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
};
