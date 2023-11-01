import { ExtendedBlock } from "@/components/quest/quest-narrative/utils";
import { log } from "next-axiom";
import { consumeEnergy, getOrCreateUserEnergy } from "../energy/energy.server";
import { getSteamshipClient } from "../utils";
import { Quest } from "./schema/quest";

const REQUIRED_ENERGY_FOR_QUEST = 10;

export const startQuest = async (userId: string, agentBase: string) => {
  const steamship = getSteamshipClient();

  const energy = await getOrCreateUserEnergy(userId);
  if (energy.energy < REQUIRED_ENERGY_FOR_QUEST) {
    log.error(
      `User ${userId} had ${energy.energy} but needed ${REQUIRED_ENERGY_FOR_QUEST} to start a quest.`
    );
    throw new Error("Not enough energy to start quest");
  }

  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/start_quest",
    arguments: {},
  });
  const quest = await resp.json();

  consumeEnergy(
    userId,
    REQUIRED_ENERGY_FOR_QUEST,
    JSON.stringify({ questName: quest.name, agentBase: agentBase })
  );

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
  throw new Error("Failed to load quest blocks");
};

export const generateQuestArc = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    const resp = await steamship.agent.post({
      url: agentBase,
      path: "/generate_quest_arc",
      arguments: {},
    });
    if (resp.ok) {
      return;
    }
  }
};
