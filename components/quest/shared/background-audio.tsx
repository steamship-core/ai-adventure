"use client";
import { useAudioModeSetting } from "@/lib/hooks";
import { Block } from "@/lib/streaming-client/src";
import { Volume2Icon, VolumeXIcon } from "lucide-react";

const BackgroundAudio = ({}: {
  isEnd: boolean;
  summary: Block | null;
  completeButtonText?: string;
}) => {
  console.log(useAudioModeSetting);
  const [isAudioMode, toggleAudioMode] = useAudioModeSetting();

  const icon = isAudioMode ? (
    <VolumeXIcon
      size={20}
      className="mr-2 text-yellow-400"
      onClick={toggleAudioMode as any}
    />
  ) : (
    <Volume2Icon
      size={20}
      className="mr-2 text-yellow-400"
      onClick={toggleAudioMode as any}
    />
  );

  // <audio id="audio" loop autoplay>
  //   <source src="music.wav" type="audio/mpeg">
  // </audio>

  return icon;
};

export default BackgroundAudio;
