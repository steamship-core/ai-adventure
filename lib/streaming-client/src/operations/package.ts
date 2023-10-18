/**
 * Parameters for creating an instance of an agent.
 *
 */
import { Client, IPackageClient, PackageInstance } from "../schema";
import { InstanceInitStatus } from "../schema/package";

/**
 * @function delay Delays the execution of an action.
 * @param {number} timeSeconds The time to wait in seconds.
 * @returns {Promise<void>}
 */
async function delay(timeSeconds: number): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(resolve, timeSeconds * 1000)
  );
}

type GetPackageInstanceParams = {
  /**
   * Handle of the package you are fetching.
   */
  handle?: string;

  /**
   * ID of the package you are fetching.
   */
  id?: string;
};

type CreatePackageInstanceParams = {
  /**
   * Handle of the agent you are creating an instance of. This is a remote service deployed to Steamship.
   */
  package: string;

  /**
   * Optional Version of the agent you are creating.
   */
  version?: string;

  /**
   * Optional handle identifying this particular agent instance. This uniquely identifies the data and chat history
   * that will be maintained by the instance.
   */
  handle?: string;

  /**
   * Optional configuration to pass to the agent upon construction.
   */
  config?: Record<string, any>;

  /**
   * Fetch if exists
   */
  fetchIfExists?: boolean;
};

export type { CreatePackageInstanceParams };

export class PackageClient implements IPackageClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async getInstance(
    params: GetPackageInstanceParams
  ): Promise<PackageInstance> {
    if (!params.handle && !params.id) {
      throw new Error(
        "Either `params.handle` or `params.id` must be provided to get a package instance"
      );
    }

    const response = await this.client.post("/package/instance/get", params);

    if (!response.ok) {
      let msg = "";
      try {
        msg = await response.text();
      } catch {}
      throw new Error(
        `Failed to fetch package instance. ${response.statusText}. ${msg}`
      );
    }
    const json = await response.json();
    return json?.data?.packageInstance as PackageInstance;
  }

  public async createInstance(
    params: CreatePackageInstanceParams
  ): Promise<PackageInstance> {
    if (!params.handle) {
      // We'll need to create a workspace for this agent so we can make sure to get/fetch the Agent in its own
      // workspace.
      const workspace_ = await this.client.workspace.create({});
      params.handle = workspace_.handle;
    }

    const { version, handle, fetchIfExists = true, config } = params;
    const response = await this.client.post("package/instance/create", {
      packageHandle: params.package,
      packageVersionHandle: version,
      handle: handle,
      fetchIfExists: fetchIfExists,
      config: config,
    });
    if (!response.ok) {
      let msg = "";
      try {
        msg = await response.text();
      } catch {}
      throw new Error(
        `Failed to create package instance. ${response.statusText}. ${msg}`
      );
    }
    const json = await response.json();
    return json?.data?.packageInstance as PackageInstance;
  }

  /**
   * Invoke a method on a package using its base_url.
   *
   * @param params
   * @param client
   */
  public async invoke(params: {
    base_url: string;
    method: string;
    payload?: Record<string, any>;
    verb?: "GET" | "POST";
  }): Promise<Response> {
    // Ensure a trailing slash.
    let base_url: string = params.base_url;
    if (!base_url) {
      throw new Error("base_url is required");
    }
    if (base_url[base_url.length - 1] != "/") {
      base_url = `${base_url}/`;
    }
    return await this.client.invokePackageMethod(base_url, params.method, {
      method: params.verb || "POST",
      body:
        params.verb == "POST"
          ? JSON.stringify(params.payload || {})
          : undefined,
      json: true,
    });
  }

  /**
   * Returns the initStatus of a Package Instance.
   *
   * @param params THe GetPackageInstanceParams object
   */
  public async getInstanceInitStatus(
    params: GetPackageInstanceParams
  ): Promise<InstanceInitStatus | undefined> {
    const instance = await this.getInstance(params);
    return instance.initStatus;
  }

  /**
   * Awaits the initialization of a package.
   *
   * Returns true/false based on initialization success.
   * Throws an error if the timeout was exceeded before completion.
   *
   * @param timeoutSeconds Timeout in seconds. Default: 0.5.
   * @param retryCount Number of times to retry. Default: 15. After this count, an exception is thrown.
   */
  public async waitForInit({
    timeoutSeconds = 0.5,
    retryCount = 15,
    handle,
    id,
  }: {
    timeoutSeconds: number;
    retryCount: number;
  } & GetPackageInstanceParams): Promise<boolean> {
    let i = 0;

    for (let i = 0; i < retryCount; i++) {
      const initStatus = await this.getInstanceInitStatus({ id, handle });
      if (initStatus === "complete" || initStatus === "notNeeded") {
        return true;
      } else if (initStatus === "failed") {
        return false;
      }
    }
    throw new Error(
      `Max tries await for package initialization exceeded: ${retryCount}`
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default PackageClient;
