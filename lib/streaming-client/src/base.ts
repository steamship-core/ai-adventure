import {Client, IAgentClient, IBlockClient, IFileClient, IPackageClient, IWorkspaceClient} from "./schema";
import PackageClient from "./operations/package";
import AgentClient from "./operations/agent";
import WorkspaceClient from "./operations/workspace";
import FileClient from "./operations/file";
import BlockClient from "./operations/block";
import {RequestOptions} from "./schema/client";

export abstract class ClientBase implements Client {
    public package: IPackageClient;
    public workspace: IWorkspaceClient;
    public agent: IAgentClient;
    public block: IBlockClient;
    public file: IFileClient;

    constructor() {
        this.package = new PackageClient(this);
        this.workspace = new WorkspaceClient(this);
        this.agent = new AgentClient(this);
        this.block = new BlockClient(this);
        this.file = new FileClient(this);
    }

    abstract url(path: string): string;
    abstract get(path: string, options?: RequestOptions): Promise<Response>;
    abstract post(path: string, payload: any, options?: RequestOptions): Promise<Response>
    abstract invokePackageMethod(url_base: string, path: string, payload: any, options?: RequestOptions): Promise<Response>
    abstract eventStream<T>(path: string, options?: RequestOptions): Promise<ReadableStream<T>>
    abstract switchWorkspace({workspace, workspaceId}: {workspace?: string, workspaceId?: string}): Client;
}
