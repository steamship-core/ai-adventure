import { Steamship } from "./client";

import {
  BlockStreamToMarkdownStream,
  FileEventStreamToBlockStream,
  SteamshipStream,
  BlockStreamToStreamingBlockStream,
  SteamshipStreamOptions,
} from "./streaming";

import type {
  Block,
  ServerSentEvent,
  BlockCreatedPayload,
  FileEvent,
  File,
  Tag,
  Task,
  Workspace,
  IsUserOwned,
  IsWorkspaceContained,
  IsSteamshipModel,
  HasHandle,
  PackageInstance,
  AgentInstance,
  Client,
} from "./schema";

export {
  Steamship,
  BlockStreamToMarkdownStream,
  FileEventStreamToBlockStream,
  SteamshipStream,
  BlockStreamToStreamingBlockStream,
};

export type { SteamshipStreamOptions };

export type {
  Client,
  Block,
  ServerSentEvent,
  BlockCreatedPayload,
  FileEvent,
  File,
  Tag,
  Task,
  Workspace,
  IsUserOwned,
  IsWorkspaceContained,
  IsSteamshipModel,
  HasHandle,
  PackageInstance,
  AgentInstance,
};

export default Steamship;
