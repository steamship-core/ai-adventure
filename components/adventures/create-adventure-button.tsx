"use client";
import { Adventure } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export const CreateAdventureButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const res = await fetch("/api/adventure", {
      method: "POST",
      body: JSON.stringify({
        name: "Epic Quest",
        description: "An amazing journey with pixel art",
      }),
    });
    if (res.ok && res.status === 201) {
      const { adventure } = (await res.json()) as { adventure: Adventure };
      router.push(`/adventures/editor/${adventure.id}`);
    } else {
      setLoading(false);
    }
  };

  return (
    <Button isLoading={loading} onClick={onClick}>
      Create a new adventure template
    </Button>
  );
};
