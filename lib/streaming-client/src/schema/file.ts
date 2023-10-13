import {
  HasHandle,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
} from "./util";
import { Tag, PartialTag } from "./tag";
import { Block, PartialBlock } from "./block";
import { Client } from "./client";
import { FileEvent } from "./event";

/**
 * File
 *
 * Files are one of the core unit of data representation in Steamship.
 *
 * Videos, PDFs, ChatHistories, Text Blobs, and JSON objects are all Files.
 *
 * Content of a file is arranged in an ordered list of Blocks.
 * Metadata of a file is added in an unordered list of Tags.
 */
export type File = IsSteamshipModel &
  IsWorkspaceContained &
  IsUserOwned &
  HasHandle & {
    tags: Tag[];
    blocks: Block[];
    mimeType?: string;
    filename?: string;
    publicData?: boolean;
  };

export type PartialFile = Partial<File>;

export interface IFileClient {
  stream(params: { id: string }): Promise<ReadableStream<FileEvent>>;
  raw(params: { id: string }): Promise<Response>;
  get(params: { id: string }): Promise<File>;
}
