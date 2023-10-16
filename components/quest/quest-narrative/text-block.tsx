import { Button } from "@/components/ui/button";
import {
  LoaderIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  Volume2Icon,
} from "lucide-react";
import { useState } from "react";
import { useAudio } from "react-use";

export function NarrationPlayer({ blockId }: { blockId: string }) {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const play = async () => {
    setUrl("");

    setLoading(true);
    const resp = await fetch("/api/game/narrate", {
      method: "POST",
      body: JSON.stringify({ block_id: blockId }),
    });
    const data = await resp.json();
    setUrl(data.url);
    setLoading(false);
  };

  const [audio, state, controls, ref] = useAudio({
    src: url,
    autoPlay: true,
  });

  return (
    <div className="flex gap-2 rounded-full border border-foreground/20">
      {audio}
      {url ? (
        <>
          <Button
            variant="ghost"
            className="rounded-full"
            size="sm"
            onClick={() => {
              if (state.playing) {
                controls.pause();
              } else {
                controls.play();
              }
            }}
          >
            {state.playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            size="sm"
            onClick={() => {
              controls.seek(state.time - state.duration);
            }}
          >
            <RotateCcwIcon size={16} />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={play}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <Volume2Icon size={16} />
          )}
        </Button>
      )}
    </div>
  );
}

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
