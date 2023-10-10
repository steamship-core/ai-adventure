"use client";
import { CompassIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Quest } from "@/lib/game/schema/quest";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StartAdventureButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    const resp = await fetch("/api/game/quest", { method: "POST" });
    const json = (await resp.json()) as { quest: Quest };
    if (json.quest.chat_file_id) {
      router.push(`/play/quest/${json.quest.chat_file_id}`);
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={onClick} isLoading={isLoading} disabled={isLoading}>
      <CompassIcon className="mr-2" size={16} />
      Go on an adventure
    </Button>
  );
};

export default StartAdventureButton;
