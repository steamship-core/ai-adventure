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
    fetch_if_exists?: boolean;
  }): Promise<Workspace>;
}
