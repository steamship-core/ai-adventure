import {
  IsFileOwned,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
} from "./util";

/**
 * Tag
 *
 * A complex key-valued object that annotates a block or file.
 *
 */
export type Tag = IsSteamshipModel &
  IsWorkspaceContained &
  IsUserOwned &
  IsFileOwned & {
    blockId?: string;
    startIdx?: number;
    endIdx?: number;
    kind: string;
    name?: string;
    value?: Record<string, any>;
    text?: string;
  };

export type PartialTag = Partial<Tag>;
