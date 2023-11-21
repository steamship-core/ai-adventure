"use client";
import { amplitude } from "@/lib/amplitude";
import { Adventure } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export const CreateAdventureButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    setIsLoading(true);
    const res = await fetch("/api/adventure", {
      method: "POST",
      body: JSON.stringify({
        name: "Epic Quest",
        description: "An amazing journey with pixel art",
      }),
    });
    if (res.ok && res.status === 201) {
      const { adventure } = (await res.json()) as { adventure: Adventure };
      amplitude.track("Button Click", {
        buttonName: "Create Adventure",
        location: "Editor",
        action: "create-adventure",
        adventureId: adventure.id,
      });
      router.push(`/adventures/editor/${adventure.id}`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Create a new adventure template"
      )}
    </Button>
  );
};
