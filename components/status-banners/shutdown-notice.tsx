"use client";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const ShutdownNotice = () => {
  const [isVisisble, setIsVisible] = useState(true);

  useEffect(() => {
    // Get the user's preference for hiding the banner from session storage
    const hideBanner = sessionStorage.getItem("hide-shutdown-banner");
    if (hideBanner) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const onClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hide-shutdown-banner", "true");
  };

  if (!isVisisble) {
    return null;
  }

  return (
    <div className="w-full">
      <Alert variant="warn" className="rounded-none py-2">
        <AlertTriangleIcon className="h-4 w-4 stroke-background" />
        <AlertTitle className="text-lg">
          AI Adventure Is Shutting Down
        </AlertTitle>
        <AlertDescription>
          AI Adventure is shutting down on January 1st, 2025. We hope you have
          enjoyed your adventures with us!
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
