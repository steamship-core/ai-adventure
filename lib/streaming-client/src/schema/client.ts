import { IPackageClient } from "./package";
import { IWorkspaceClient } from "./workspace";
import { IAgentClient } from "./agent";
import { IBlockClient } from "./block";
import { IFileClient } from "./file";

export const API_BASE_PRODUCTION = "https://api.steamship.com/api/v1/";
export const API_BASE_STAGING = "https://api.staging.steamship.com/api/v1/";
export const API_BASE_DEVELOPMENT = "http://localhost:8080/api/v1/";

export const APP_BASE_PRODUCTION = "https://api.steamship.run/";
export const APP_BASE_STAGING = "https://apps.staging.steamship.com/";
export const APP_BASE_DEVELOPMENT = "http://localhost:8081/";

export type Configuration = {
  apiBase?: string;
  appBase?: string;
  apiKey?: string;
  workspace?: string;
  workspaceId?: string;
};

export const DEFAULT_CONFIGURATION = {
  apiBase: API_BASE_PRODUCTION,
  appBase: API_BASE_PRODUCTION,
};

export type RequestOptions = {
  workspace?: string;
  workspaceId?: string;
  verb?: "GET" | "POST";
  body?: any;
  baseUrl?: string;
};

/**
 * Interface for a Steamship client.
 */
export interface Client {
  url(path: string): string;
  get(path: string, options?: RequestOptions): Promise<Response>;
  post(path: string, payload: any, options?: RequestOptions): Promise<Response>;
  invokePackageMethod(
    url_base: string,
    path: string,
    payload: any,
    options?: RequestOptions
  ): Promise<Response>;
  eventStream<T>(
    path: string,
    options?: RequestOptions
  ): Promise<ReadableStream<T>>;
  switchWorkspace({
    workspace,
    workspaceId,
  }: {
    workspace?: string;
    workspaceId?: string;
  }): Client;

  package: IPackageClient;
  workspace: IWorkspaceClient;
  agent: IAgentClient;
  block: IBlockClient;
  file: IFileClient;
}
