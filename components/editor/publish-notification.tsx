"use client";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { track } from "@vercel/analytics/react";
import { log } from "next-axiom";
import { useState } from "react";

const PublishCTA = ({ className = "" }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { adventureId } = useEditorRouting();

  const onClick = async () => {
    setIsLoading(true);
    track("Click Button", {
      buttonName: "Publish Adventure",
      location: "Editor",
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
    <div className="w-full text-sm flex flex-col items-startt text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800 py-2 px-2">
      <span className="font-medium">Unpublished Changes</span>
      <span>
        Click <i>Test</i> to try. Click <i>Publish</i> to share.
      </span>
    </div>
  );
};

export default PublishCTA;
