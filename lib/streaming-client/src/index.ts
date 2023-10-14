import { Steamship } from "./client";

import {
  BlockStreamToMarkdownStream,
  BlockStreamToStreamingBlockStream,
  FileEventStreamToBlockStream,
  SteamshipStream,
  SteamshipStreamOptions,
} from "./streaming";

import type {
  AgentInstance,
  Block,
  BlockCreatedPayload,
  Client,
  File,
  FileEvent,
  HasHandle,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
  PackageInstance,
  PartialBlock,
  ServerSentEvent,
  Tag,
  Task,
  Workspace,
} from "./schema";

export {
  BlockStreamToMarkdownStream,
  BlockStreamToStreamingBlockStream,
  FileEventStreamToBlockStream,
  Steamship,
  SteamshipStream,
};

export type { SteamshipStreamOptions };

export type {
  AgentInstance,
  Block,
  BlockCreatedPayload,
  Client,
  File,
  FileEvent,
  HasHandle,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
  PackageInstance,
  PartialBlock,
  ServerSentEvent,
  Tag,
  Task,
  Workspace,
};

export default Steamship;
