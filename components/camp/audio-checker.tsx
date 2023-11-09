"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { recoilBackgroundAudioUrlState } from "../providers/recoil";
import {
  ExtendedBlock,
  MessageTypes,
  getMessageType,
} from "../quest/quest-narrative/utils";

export function AudioChecker({ questId }: { questId?: string }) {
  const initialized = useRef(false);
  const params = useParams<{ handle: string }>();
  const [_, setAudioUrl] = useRecoilState(recoilBackgroundAudioUrlState);

  const checkAudio = async (isCampAudio: boolean) => {
    const url = isCampAudio
      ? `/api/game/${params.handle}/camp`
      : `/api/game/${params.handle}/quest?questId=${questId}`;

    // On the first load, get the quest history
    const response = await fetch(url);
    if (response.ok) {
      let blocks = ((await response.json()) || {}).blocks as ExtendedBlock[];
      if (blocks && blocks.length > 0) {
        for (let block of blocks.reverse()) {
          const mt = getMessageType(block);
          const mtCamp = mt === MessageTypes.CAMP_AUDIO;
          const mtQuest = mt === MessageTypes.SCENE_AUDIO;
          if ((mtCamp && isCampAudio) || (mtQuest && !isCampAudio)) {
            (setAudioUrl as any)(block.streamingUrl);
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
    // This suppresses the double-loading. My hypothesis is that this is happening in dev as a result of strict mode, but
    // even in dev it messes with the remote agent.
    if (!initialized.current) {
      initialized.current = true;

      const gameId = params.handle;
      const isCampAudio: boolean = !(typeof questId != "undefined" && questId);
      checkAudio(isCampAudio);
    }
  }, []);

  return <></>;
}
