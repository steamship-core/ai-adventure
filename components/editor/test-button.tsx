"use client";
import { amplitude } from "@/lib/amplitude";
import { useEditorRouting } from "@/lib/editor/use-editor";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

const TestButton = ({ className = "" }: { className?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { adventureId } = useEditorRouting();

  const onClick = async () => {
    amplitude.track("Button Click", {
      buttonName: "Test Adventure",
      location: "Editor",
      action: "test-adventure",
      adventureId: adventureId,
    });
  };

  return (
    <Button
      isLoading={isLoading}
      onClick={onClick}
      disabled={isLoading}
      className={`${className}`}
    >
      <Link
        target="_blank"
        href={`/adventures/${adventureId}?isDevelopment=true`}
        className="flex flex-row justify-start items-center"
      >
        <RocketIcon className="h-6 w-6 fill-blue-600 text-blue-600 mr-2" />
        Test
      </Link>
    </Button>
  );
};

export default TestButton;
