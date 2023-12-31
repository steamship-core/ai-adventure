import { Tag } from "./tag";
import {
  IsFileOwned,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
} from "./util";

/**
 * Block
 *
 * Blocks store the content of a file.
 *
 *  Content of a block can either be in the `text` field or stored remotely in S3.
 *  Metadata of a block is added in an unordered list of Tags.
 */
export type Block = IsSteamshipModel &
  IsWorkspaceContained &
  IsUserOwned &
  IsFileOwned & {
    text?: string;
    tags?: Tag[];
    contentUrl?: string;
    mimeType?: string;
    url?: string;
    index: number;
    publicData: boolean;
    streamState?: "started" | "complete" | "aborted";
  };

export type PartialBlock = Partial<Block>;

export interface IBlockClient {
  raw(params: { id: string }): Promise<Response>;
  get(params: { id: string }): Promise<Block>;
}
