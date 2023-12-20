import { Client, IWorkspaceClient, Workspace } from "../schema";

export class WorkspaceClient implements IWorkspaceClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Creates a new Workspace.
   *
   * @param params
   * @param client
   */
  public async create(params: {
    handle?: string;
    fetchIfExists?: boolean;
  }): Promise<Workspace> {
    const { handle, fetchIfExists = true } = params;
    const response = await this.client.post("workspace/create", {
      handle,
      fetchIfExists,
    });
    const json = await response.json();
    return json?.workspace || (json?.data?.workspace as Workspace);
  }

  /** Delete a workspace and all data in it. */
  public async delete(params: {
    handle?: string;
    id?: string;
  }): Promise<Workspace> {
    if (!params.handle && !params.id) {
      throw new Error(
        "Either `params.handle` or `params.id` must be provided to get a package instance"
      );
    }

    let response = await this.client.post(`workspace/delete`, params);
    let json = await response.json();
    return (json?.workspace || json?.data?.workspace) as Workspace;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default WorkspaceClient;
