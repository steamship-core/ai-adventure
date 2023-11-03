import { HasHandle, IsSteamshipModel, IsUserOwned } from "./util";

/**
 * Workspace
 *
 * An isolated data container in the cloud.
 */
export type Workspace = IsSteamshipModel & IsUserOwned & HasHandle & {};

export type PartialWorkspace = Partial<Workspace>;

export interface IWorkspaceClient {
  create(params: {
    handle?: string;
    fetchIfExists?: boolean;
  }): Promise<Workspace>;

  delete(params: { handle?: string; id?: string }): Promise<Workspace>;
}
