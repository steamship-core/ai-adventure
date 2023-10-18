import {
  CreatePackageInstanceParams,
  GetPackageInstanceParams,
} from "../operations/package";
import {
  HasHandle,
  IsSteamshipModel,
  IsUserOwned,
  IsWorkspaceContained,
} from "./util";

export type InstanceInitStatus =
  | "notNeeded"
  | "initializing"
  | "complete"
  | "failed";

/**
 * Steamship Package Instance.
 *
 * Package Instances are copies of a Package or Agent running in the cloud.
 *
 * They maintain their own task queue, set of web endpoints, chat histories, and data.
 */
export type PackageInstance = IsSteamshipModel &
  IsWorkspaceContained &
  IsUserOwned &
  HasHandle & {
    /**
     * The invocation URL base of the package.
     */
    invocationURL: string;

    /**
     * The handle of the package tied to this instance.
     */
    packageHandle: string;

    /**
     * The ID of the package tied to this instance.
     */
    packageId: string;

    /**
     * The handle of the package version tied to this instance.
     */
    packageVersionHandle: string;

    /**
     * The ID of the package version tied to this instance.
     */
    packageVersionId: string;

    /**
     * The ID of the workspace this instance resides within.
     */
    workspaceId: string;

    /**
     * The ID of the initialization task for this package.
     */
    initTaskID: string;

    /**
     * The handle of the user for this package.
     */
    userHandle: string;

    /**
     * The init status of the package.
     */
    initStatus?: InstanceInitStatus;
  };

export type PartialPackageInstance = Partial<PackageInstance>;

export interface IPackageClient {
  createInstance(params: CreatePackageInstanceParams): Promise<PackageInstance>;
  invoke(params: {
    base_url: string;
    method: string;
    payload?: Record<string, any>;
    verb?: "GET" | "POST";
  }): Promise<Response>;

  waitForInit({
    timeoutSeconds = 0.5,
    retryCount = 15,
    handle,
    id,
  }: {
    timeoutSeconds: number;
    retryCount: number;
  } & GetPackageInstanceParams): Promise<boolean>;

  getInstanceInitStatus(
    params: GetPackageInstanceParams
  ): Promise<InstanceInitStatus | undefined>;
}
