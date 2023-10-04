import {
  QuestContainer,
  QuestContentContainer,
  QuestNarrativeContainer,
} from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import InventorySheet from "../inventory-sheet";
import EndSheet from "./shared/end-sheet";

export default async function Quest() {
  return (
    <QuestContainer>
      <QuestContentContainer>
        <div className="flex justify-between items-center border-b border-b-foreground/10 pb-4">
          <Button asChild variant="link" className="pl-0">
            <Link href="/play/camp">Back to Camp</Link>
          </Button>
          <InventorySheet buttonText="View Inventory" />
        </div>
        <QuestNarrativeContainer>
          <div>I am a quest thing</div>
        </QuestNarrativeContainer>
        <div className="flex flex-col gap-2">
          <Input className="w-full" />
          <EndSheet />
        </div>
      </QuestContentContainer>
    </QuestContainer>
  );
}

/*
* Existing chat widget
* When encountering a new block, may be a chat block or may not be
* Need a getBlockType helper to look through all tags and determine block

Block Types
* new background
* background audio
* narration (of a text block you already have!)
* character image
* Anything else, if it’s role assistant should be shown as text
*/
