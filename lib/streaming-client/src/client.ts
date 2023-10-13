import { createParser } from "eventsource-parser";
import { ClientBase } from "./base";
import { Client } from "./schema";
import { Configuration } from "./schema/client";
import { EventSourceParserStream } from "eventsource-parser/stream";

/**
 * Steamship API client.
 *
 * Intended for use consuming Steamship's API.
 */
export class Steamship extends ClientBase implements Client {
  /**
   * Create a new Steamship API client.
   *
   * @param config
   */
  constructor(config: Configuration) {
    super(config);
  }

  private workspaceHandleFromBaseUrl(baseUrl: string): string {
    try {
      const urlParts = baseUrl.split("//");
      const domainAndPath = urlParts[1];
      const pathParts = domainAndPath.split("/");
      const workspace = pathParts[1];
      return workspace;
    } catch (ex) {
      throw Error(
        `Error trying to parse workspace handle out of base url: ${baseUrl}`
      );
    }
  }

  private makeHeaders(props: {
    json: boolean;
    existing?: Record<string, string>;
    workspace?: string;
    workspaceId?: string;
    baseUrl?: string;
  }) {
    let _headers: Record<string, string> = {};
    if (this.config.apiKey) {
      _headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }
    if (props.json) {
      _headers["Content-Type"] = `application/json`;
    }
    if (props.workspace) {
      _headers["x-workspace-handle"] = props.workspace;
    } else if (props.workspaceId) {
      _headers["x-workspace-id"] = props.workspaceId;
    }
    return {
      ..._headers,
      ...props.existing,
    };
  }

  /**
   * Return the fully-specified URL for an API path.
   *
   * @param path
   */
  public url(path: string): string {
    return `${this.config.apiBase}${path}`;
  }

  /**
   * Invoke an API method on a Steamship package.
   *
   * @param apiBase
   * @param path API Path rooted in apiBase provided in the configuration object.
   * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
   */
  public async invokePackageMethod(
    apiBase: string,
    path: string,
    opts?: any
  ): Promise<Response> {
    // Parse the workspace out of the api_base.
    const workspace = this.workspaceHandleFromBaseUrl(apiBase);
    if (!opts.workspace) {
      opts.workspace = workspace;
    }

    const _url = `${apiBase}${path}`;
    opts["headers"] = this.makeHeaders({
      json: true,
      existing: opts.headers,
      workspace: opts.workspace || this.config.workspace,
      workspaceId: opts.workspaceId || this.config.workspaceId,
      baseUrl: opts.baseUrl,
    });
    try {
      return await fetch(_url, opts);
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  }

  /**
   * Invoke an API method on Steamship.
   *
   * @param path API Path rooted in apiBase provided in the configuration object.
   * @param opts Javascript `fetch` options. API Key and Content-Type are auto-applied.
   */
  public async invokeApi(path: string, opts: any): Promise<Response> {
    // Transform 'file/get' into https://url/api/v1/file/get
    const _url = this.url(path);

    opts["headers"] = this.makeHeaders({
      json: true,
      existing: opts.headers,
      workspace: opts.workspace || this.config.workspace,
      workspaceId: opts.workspaceId || this.config.workspaceId,
      baseUrl: opts.baseUrl,
    });

    if (opts.method && opts.method.toUpperCase() != "POST") {
      delete opts["body"];
    }

    const resp = await fetch(_url, opts);
    return resp;
  }

  /**
   * Perform a `get` against the Steamship API.
   * @param path API Path rooted in apiBase provided in the configuration object.
   */
  public async get(path: string): Promise<Response> {
    return this.invokeApi(path, { method: "GET" });
  }

  /**
   * Perform a 'post' against the Steamship API
   * @param path API Path rooted in apiBase provided in the configuration object.
   * @param payload Payload, as a JSON object, to be provided as JSON to Steamship.
   */
  public async post(path: string, payload: any): Promise<Response> {
    return this.invokeApi(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async switchWorkspace({
    workspace,
    workspaceId,
  }: {
    workspace?: string;
    workspaceId?: string;
  }): Promise<Client> {
    let newConfig = { ...this.config };
    delete newConfig.workspace;
    delete newConfig.workspaceId;

    if (workspace) {
      // Make sure it's created
      await this.workspace.create({
        handle: workspace,
        fetchIfExists: true,
      });
      newConfig.workspace = workspace;
    }

    newConfig.workspace = workspace;
    newConfig.workspaceId = workspaceId;

    return new Steamship(newConfig);
  }

  public async eventStream<T>(
    path: string,
    opts: any
  ): Promise<ReadableStream<T>> {
    const res = await this.invokeApi(path, opts);
    if (!res.ok) {
      console.log("Not ok");
      var body = "";
      try {
        body = await res.text();
      } catch (ex) {}
      throw Error(
        `Error creating stream: ${res.status} ${res.statusText} ${body}`
      );
    }

    // @ts-ignore
    return new ReadableStream({
      async pull(controller): Promise<void> {
        for await (const chunk of res.body as any) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    })
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());
  }
}
