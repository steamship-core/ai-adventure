import {
  QuestContainer,
  QuestContentContainer,
  QuestNarrativeContainer,
} from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import InventorySheet from "../inventory-sheet";

export default async function Quest() {
  return (
    <QuestContainer>
      <QuestContentContainer>
        <div className="flex justify-between items-center border-b border-b-foreground/10 pb-4">
          <Button asChild variant="ghost">
            <Link href="/play/camp">Back to Camp</Link>
          </Button>
          <InventorySheet buttonText="View Inventory" />
        </div>
        <QuestNarrativeContainer>
          <div>I am a quest thing</div>
        </QuestNarrativeContainer>
        <Input className="w-full" />
      </QuestContentContainer>
    </QuestContainer>
  );
}
