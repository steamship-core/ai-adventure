import { recoilNarrationBlockIdState } from "@/components/recoil-provider";
import { Volume2Icon } from "lucide-react";
import { useRecoilState } from "recoil";

export const TextBlock = ({
  text,
  blockId,
}: {
  text: string;
  blockId?: string;
}) => {
  const [_, setNarrationBlockId] = useRecoilState(recoilNarrationBlockIdState);

  return (
    <div>
      <p className="whitespace-pre-wrap text-sm">{text}</p>
      <Volume2Icon
        onClick={() => {
          console.log("Narrate", blockId);
          setNarrationBlockId(blockId);
        }}
      />
    </div>
  );
};
