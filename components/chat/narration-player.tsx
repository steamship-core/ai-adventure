import { Button } from "@/components/ui/button";
import { amplitude } from "@/lib/amplitude";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAudio } from "react-use";

export function NarrationPlayer({ blockId }: { blockId: string }) {
  const [didPlay, setDidPlay] = useState(false);
  const params = useParams();
  const [audioRequested, setAudioRequested] = useState(false);

  const { data: url } = useQuery({
    queryKey: ["narration", blockId],
    queryFn: async () => {
      const resp = await fetch(`/api/game/${params.handle}/narrate`, {
        method: "POST",
        body: JSON.stringify({ block_id: blockId }),
      });
      const data = await resp.json();
      return data.url || "";
    },
    refetchOnWindowFocus: false,
    enabled: audioRequested,
  });

  const [audio, state, controls, ref] = useAudio({
    src: url,
    autoPlay: false,
  });

  const isProcessing = !url && audioRequested;

  return (
    <div className="flex gap-2 rounded-full border border-foreground/20">
      {audio}
      <Button
        variant="ghost"
        className="rounded-full"
        size="sm"
        // disabled={!url || state.buffered.length === 0}
        onClick={async () => {
          if (!didPlay) {
            amplitude.track("Button Click", {
              buttonName: "Play Narration",
              location: "Quest",
              action: "play-narration",
              questId: params.questId,
              workspaceHandle: params.handle,
              blockId: blockId,
            });
          }
          setDidPlay(true);
          setAudioRequested(true);

          if (state.playing) {
            controls.pause();
          } else {
            controls.play();
          }
        }}
      >
        {state.playing ? (
          <PauseIcon size={16} />
        ) : isProcessing ? (
          <LoaderIcon size={16} />
        ) : (
          <PlayIcon size={16} />
        )}
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
