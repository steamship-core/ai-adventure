"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import EndSheet from "./shared/end-sheet";
import InventorySheet from "../inventory-sheet";
import { GameState } from "@/lib/game/schema/game_state";
import { useParams } from "next/navigation";
import { useChat } from "ai/react";

const MINIUM_MESSAGE_COUNT = 1;

export const QuestHeader = ({ gameState }: { gameState: GameState }) => {
  const { questId } = useParams();
  const { messages } = useChat({ id: questId as string });

  const userMessages = messages.filter((message) => message.role === "user");

  return (
    <div className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
      <Button asChild variant="link" className="pl-0">
        <Link href="/play/camp">
          <ArrowLeftIcon size={16} />
        </Link>
      </Button>
      <div className="flex items-center justify-center">
        {userMessages.length >= MINIUM_MESSAGE_COUNT && (
          <EndSheet isEnd={false} />
        )}
        <InventorySheet gameState={gameState} text="" />
      </div>
    </div>
  );
};
