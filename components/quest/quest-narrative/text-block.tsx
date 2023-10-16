import { Button } from "@/components/ui/button";
import { useNarration } from "@/lib/hooks";
import { Volume2Icon } from "lucide-react";

export const TextBlock = ({
  text,
  blockId,
  offerAudio,
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
}) => {
  const { updateBlockId } = useNarration();
  const play = () => {
    if (blockId && updateBlockId) {
      updateBlockId(blockId);
    }
  };

  return (
    <p data-blocktype="text-block" className="whitespace-pre-wrap text-normal">
      {text}{" "}
      {blockId && offerAudio && (
        <Button variant="outline" onClick={play} size="sm">
          <Volume2Icon size={20} />
        </Button>
      )}
    </p>
  );
};
