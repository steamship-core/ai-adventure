import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import { useAudio } from "react-use";

export function AudioPreview({ voiceId }: { voiceId: string }) {
  const [didPlay, setDidPlay] = useState(false);
  const src = `/voice_samples/${voiceId}.mp3`;

  const [audio, state, controls, ref] = useAudio({
    src: src,
    autoPlay: false,
  });

  return (
    <div className="rounded-full z-100">
      {audio}
      <Button
        variant="ghost"
        className="rounded-full"
        size="sm"
        // disabled={state.buffered.length === 0}
        onClick={(e) => {
          e?.stopPropagation();
          e?.preventDefault();
          if (didPlay) {
            controls.seek(state.time - state.duration);
          }
          setDidPlay(true);
          if (state.playing) {
            controls.pause();
          } else {
            controls.play();
          }
          return false;
        }}
      >
        {state.playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
      </Button>
    </div>
  );
}
