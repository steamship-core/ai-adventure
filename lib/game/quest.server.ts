import {
  getMessageType,
  inputTypes,
  validTypes,
} from "@/lib/chat/block-chat-types";
import { ExtendedBlock } from "@/lib/chat/extended-block";
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

  console.log(
    `User ${userId} consuming energy ${REQUIRED_ENERGY_FOR_QUEST} for quest ${quest.name}`
  );
  log.info(
    `User ${userId} consuming energy ${REQUIRED_ENERGY_FOR_QUEST} for quest ${quest.name}`
  );

  await consumeEnergy(
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
      block.messageType = getMessageType(block);
      block.isVisibleInChat = validTypes.includes(block.messageType);
      block.isInputElement = inputTypes.includes(block.messageType);
      return block;
    });
  }
  throw new Error("Failed to load quest blocks");
};

export const loadExistingCampBlocks = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  const resp = await steamship.agent.post({
    url: agentBase,
    path: "/get_camp_blocks",
    arguments: {},
  });
  if (resp.ok) {
    let blocks = (await resp.json()) as ExtendedBlock[];
    return blocks.map((block) => {
      block.streamingUrl = `${process.env.NEXT_PUBLIC_STEAMSHIP_API_BASE}block/${block.id}/raw`;
      block.historical = true;
      block.messageType = getMessageType(block);
      block.isVisibleInChat = validTypes.includes(block.messageType);
      block.isInputElement = inputTypes.includes(block.messageType);
      return block;
    });
  }
  throw new Error("Failed to load camp blocks");
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

export const generateActionChoices = async (agentBase: string) => {
  const steamship = getSteamshipClient();
  try {
    const resp = await steamship.agent.post({
      url: agentBase,
      path: "/generate_action_choices",
      arguments: {},
    });
    const json = await resp.json();
    return json;
  } catch (e) {
    console.log("error", e);
    log.error(`${e}`);
  }
};
