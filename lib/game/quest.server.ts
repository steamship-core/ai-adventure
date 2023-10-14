import { Block } from "@/lib/streaming-client/src";
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
  console.log("Agent Base", agentBase);
  console.log("QuestId", questId);

  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/get_quest",
    arguments: {
      quest_id: questId,
    },
  });
  const blocks = await resp.json();
  return blocks as Block[];
};
