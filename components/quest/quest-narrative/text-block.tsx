import { NarrationPlayer } from "./narration-player";

export const TextBlock = ({
  text,
  blockId,
  offerAudio,
}: {
  text: string;
  blockId?: string;
  offerAudio?: boolean;
}) => {
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
          <NarrationPlayer blockId={blockId} />
          <div className="w-full px-2">
            <div className="border-t border-foreground/20 w-full px-2" />
          </div>
        </div>
      )}
    </div>
  );
};
