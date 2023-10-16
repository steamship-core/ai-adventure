import { Button } from "@/components/ui/button";
import { useNarration } from "@/lib/hooks";
import { LoaderIcon, Volume2Icon } from "lucide-react";

export const TextBlock = ({
  text,
  blockId,
  offerAudio,
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
}) => {
  const {
    isAllowed,
    url,
    blockId: activeNarrationBlockId,
    updateBlockId,
  } = useNarration();

  const play = () => {
    if (blockId && updateBlockId) {
      updateBlockId(blockId);
    }
  };

  const audioLoading = isAllowed && !url && activeNarrationBlockId === blockId;
  return (
    <div className="group">
      <p
        data-blocktype="text-block"
        className="whitespace-pre-wrap text-normal hover:!bg-background group-hover:bg-sky-300/10 rounded-md"
      >
        {text}
      </p>
      {blockId && offerAudio && (
        <div className="w-full flex items-center justify-center mt-2">
          <div className="w-full px-2">
            <div className="border-t border-foreground/20 w-full px-2" />
          </div>
          <Button
            variant="outline"
            className="group"
            onClick={play}
            disabled={audioLoading}
            size="sm"
          >
            {audioLoading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <Volume2Icon size={20} />
            )}
          </Button>
          <div className="w-full px-2">
            <div className="border-t border-foreground/20 w-full px-2" />
          </div>
        </div>
      )}
    </div>
  );
};
