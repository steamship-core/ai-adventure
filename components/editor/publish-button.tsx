"use client";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { track } from "@vercel/analytics/react";
import { SparklesIcon } from "lucide-react";
import { log } from "next-axiom";
import { useState } from "react";
import { Button } from "../ui/button";

const PublishButton = ({ className = "" }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { adventureId } = useEditorRouting();

  const onClick = async () => {
    setIsLoading(true);
    track("Click Button", {
      buttonName: "Publish Adventure",
      location: "Camp",
    });

    const resp = await fetch("/api/editor", {
      method: "POST",
      body: JSON.stringify({
        operation: "publish",
        id: adventureId,
      }),
    });

    if (!resp.ok) {
      setIsLoading(false);
      setIsVisible(false);
      let res = "";
      try {
        res = await resp.text();
      } catch {}
      log.error(`Failed to start quest: ${res}`);
      return;
    }
    alert("Success! New games will reflect these settings.");
    setIsLoading(false);
    setIsVisible(false);
    log.debug(`Published Adventure: ${adventureId}`);
  };

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={isLoading}
        className={`justify-start ${className}`}
      >
        <SparklesIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        Publish
      </Button>
    </>
  );
};

export default PublishButton;
