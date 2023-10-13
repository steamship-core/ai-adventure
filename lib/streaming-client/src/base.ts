import {
  Client,
  IAgentClient,
  IBlockClient,
  IFileClient,
  IPackageClient,
  IWorkspaceClient,
} from "./schema";
import PackageClient from "./operations/package";
import AgentClient from "./operations/agent";
import WorkspaceClient from "./operations/workspace";
import FileClient from "./operations/file";
import BlockClient from "./operations/block";
import {
  Configuration,
  DEFAULT_CONFIGURATION,
  RequestOptions,
} from "./schema/client";
import { IUserClient } from "./schema/user";
import UserClient from "./operations/user";

export abstract class ClientBase implements Client {
  public package: IPackageClient;
  public workspace: IWorkspaceClient;
  public agent: IAgentClient;
  public block: IBlockClient;
  public file: IFileClient;
  public user: IUserClient;
  public config: Configuration;

  constructor(config: Configuration) {
    this.package = new PackageClient(this);
    this.workspace = new WorkspaceClient(this);
    this.agent = new AgentClient(this);
    this.block = new BlockClient(this);
    this.file = new FileClient(this);
    this.user = new UserClient(this);
    this.config = { ...DEFAULT_CONFIGURATION, ...config };
  }

  abstract url(path: string): string;
  abstract get(path: string, options?: RequestOptions): Promise<Response>;
  abstract post(
    path: string,
    payload: any,
    options?: RequestOptions
  ): Promise<Response>;
  abstract invokePackageMethod(
    url_base: string,
    path: string,
    payload: any,
    options?: RequestOptions
  ): Promise<Response>;
  abstract eventStream<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ReadableStream<T>>;
  abstract switchWorkspace({
    workspace,
    workspaceId,
  }: {
    workspace?: string;
    workspaceId?: string;
  }): Promise<Client>;
}
