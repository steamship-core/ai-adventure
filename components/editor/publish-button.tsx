"use client";
import { amplitude } from "@/lib/amplitude";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { SparklesIcon } from "lucide-react";
import { log } from "next-axiom";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const PublishButton = ({
  onPublish,
  className = "",
}: {
  className?: string;
  onPublish: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { adventureId } = useEditorRouting();
  const { toast } = useToast();

  const onClick = async () => {
    setIsLoading(true);
    amplitude.track("Button Click", {
      buttonName: "Publish Adventure",
      location: "Editor",
      action: "publish-adventure",
      adventureId: adventureId,
    });

    const resp = await fetch(`/api/adventure/${adventureId}`, {
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
    const { dismiss } = toast({
      title: "Published!",
      description: "New games will reflect these settings.",
    });
    setTimeout(() => {
      dismiss();
    }, 2000);
    setIsLoading(false);
    setIsVisible(true);
    onPublish();
    log.debug(`Published Adventure: ${adventureId}`);
  };

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={isLoading}
        className={`justify-start ${className}`}
        id="publish-button"
      >
        <SparklesIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        Publish
      </Button>
    </>
  );
};

export default PublishButton;
