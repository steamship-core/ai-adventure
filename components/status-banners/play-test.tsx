"use client";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

export const PlayTestBanner = () => {
  return (
    <div className="w-full">
      <Alert variant="info" className="rounded-none py-2">
        <AlertTriangleIcon className="h-4 w-4 stroke-background" />
        <AlertTitle className="text-lg">
          Play test of unpublished adventure.
        </AlertTitle>
      </Alert>
    </div>
  );
};
