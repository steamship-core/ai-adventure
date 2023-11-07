import { useEffect } from "react";
import { useAudio } from "react-use";

export default function AudioPlayer({
  active = false,
  loop = false,
  volume = 1.0,
  url,
}: {
  active: boolean;
  url?: string;
  loop?: boolean;
  volume?: number;
}) {
  const [audio, state, controls, ref] = useAudio({
    src: url || "",
    autoPlay: active == true,
    loop,
  });

  useEffect(() => {
    if (active == true && url && url.length) {
      if (controls) {
        if (typeof volume !== "undefined") {
          controls.volume(volume);
        }
        controls.play();
      }
    } else {
      if (controls) {
        if (typeof volume !== "undefined") {
          controls.volume(volume);
        }
        controls.pause();
      }
    }
  }, [active, url]); // NOTE: Adding the audio dependencies here causes an infinite loop!

  return audio;
}
