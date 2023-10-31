import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAudio } from "react-use";

export function NarrationPlayer({ blockId }: { blockId: string }) {
  const [didPlay, setDidPlay] = useState(false);
  const params = useParams();
  const { data: url } = useQuery({
    queryKey: ["narration", blockId],
    queryFn: async () => {
      const resp = await fetch(`/api/game/${params.handle}/narrate`, {
        method: "POST",
        body: JSON.stringify({ block_id: blockId }),
      });
      const data = await resp.json();
      console.log(data);
      return data.url || "";
    },
    refetchOnWindowFocus: false,
  });

  const [audio, state, controls, ref] = useAudio({
    src: url,
    autoPlay: false,
  });

  return (
    <div className="flex gap-2 rounded-full border border-foreground/20">
      {audio}
      <Button
        variant="ghost"
        className="rounded-full"
        size="sm"
        disabled={!url || state.buffered.length === 0}
        onClick={() => {
          setDidPlay(true);
          if (state.playing) {
            controls.pause();
          } else {
            controls.play();
          }
        }}
      >
        {state.playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
      </Button>
      {didPlay && (
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
      )}
    </div>
  );
}
