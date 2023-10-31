"use client";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { track } from "@vercel/analytics/react";
import { RocketIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const TestButton = ({ className = "" }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { adventureId } = useEditorRouting();

  const onClick = async () => {
    setIsLoading(true);
    track("Click Button", {
      buttonName: "Test Adventure",
      location: "Camp",
    });
    alert("TODO: Re-direct to a transient copy of the game.");
    setIsLoading(false);
    setIsVisible(true);
  };

  return (
    <>
      <Button
        onClick={onClick}
        isLoading={isLoading}
        disabled={isLoading}
        className={`justify-start ${className}`}
      >
        <RocketIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        Test
      </Button>
    </>
  );
};

export default TestButton;
