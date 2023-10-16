import { useNarration } from "@/lib/hooks";
import { Volume2Icon } from "lucide-react";

export const TextBlock = ({
  text,
  blockId,
}: {
  text: string;
  blockId?: string;
}) => {
  const [_1, _2, _3, setBlockId] = useNarration();
  const play = () => {
    if (blockId && setBlockId) {
      (setBlockId as any)(blockId as string);
    }
  };

  return (
    <p data-blocktype="text-block" className="whitespace-pre-wrap text-sm">
      {text} {blockId && <Volume2Icon onClick={play} />}
    </p>
  );
};
