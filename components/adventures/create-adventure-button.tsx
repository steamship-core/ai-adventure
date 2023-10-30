"use client";
import { Adventure } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const CreateAdventureButton = () => {
  const router = useRouter();
  const onClick = async () => {
    const res = await fetch("/api/adventure", {
      method: "POST",
      body: JSON.stringify({
        name: "Epic Quest",
        description: "An amazing journey with pixel art",
        agentVersion: "ai-adventure",
      }),
    });
    if (res.ok && res.status === 201) {
      const { adventure } = (await res.json()) as { adventure: Adventure };
      router.push(`/adventures/${adventure.id}`);
    }
  };

  return <Button onClick={onClick}>Create a new adventure template</Button>;
};
