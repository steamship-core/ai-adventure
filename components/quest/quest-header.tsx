"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { Block } from "@/lib/streaming-client/src";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import InventorySheet from "../inventory-sheet";
import { Button } from "../ui/button";

const MINIUM_MESSAGE_COUNT = 2;

export const QuestHeader = ({
  gameState,
  id,
  summary,
  isComplete,
}: {
  gameState: GameState;
  id: string;
  summary: Block | null;
  isComplete: boolean;
}) => {
  return (
    <div className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
      {!isComplete ? (
        <Button asChild variant="link" className="pl-0">
          <Link href="/play/camp">
            <ArrowLeftIcon size={16} />
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <div className="flex items-center justify-center">
        <InventorySheet gameState={gameState} text="" />
      </div>
    </div>
  );
};
