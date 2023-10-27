import { ExtendedBlock } from "@/components/quest/quest-narrative/utils";
import { getSteamshipClient } from "../utils";
import { Quest } from "./schema/quest";

export const startQuest = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/start_quest",
    arguments: {},
  });
  const quest = await resp.json();
  return quest as Quest;
};

export const loadExistingQuestBlocks = async (
  agentBase: string,
  questId: string
) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/get_quest",
    arguments: {
      quest_id: questId,
    },
  });
  if (resp.ok) {
    let blocks = (await resp.json()) as ExtendedBlock[];
    return blocks.map((block) => {
      block.streamingUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`;
      block.historical = true;
      return block;
    });
  }
  return [];
};

export const generateQuestArc = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/generate_quest_arc",
    arguments: {},
  });
};
