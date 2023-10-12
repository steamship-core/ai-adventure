import {
  Client,
  AgentInstance,
  Block,
  FileEvent,
  IFileClient,
  File,
} from "../schema";

export class FileClient implements IFileClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Creates a new Workspace.
   *
   * @param params
   */
  public async stream(params: {
    id: string;
  }): Promise<ReadableStream<FileEvent>> {
    return await this.client.eventStream(`file/${params.id}/stream`, {});
  }

  /**
   * Fetch the raw content of the file.
   *
   * @param params
   */
  public async raw(params: { id: string }): Promise<Response> {
    return await this.client.get(`file/${params.id}/raw`, {});
  }

  /**
   * Fetch a Steamship File.
   *
   * @param params
   */

  public async get(params: { id: string }): Promise<File> {
    let response = await this.client.post(`file/get`, { id: params.id });
    let json = await response.json();
    return (json?.file || json?.data?.file) as File;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default FileClient;
