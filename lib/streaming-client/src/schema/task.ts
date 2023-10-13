import { IsUserOwned, IsWorkspaceContained } from "./util";

/**
 * Task
 *
 * All work in Steamship can be expressed as an async Task running on the server. This enables scheduling
 * and chaining of user & agent workflows.
 */
export type Task = IsWorkspaceContained &
  IsUserOwned & {
    taskId: string;
    requestId?: string;
    input?: string;
    output?: string;
    state: "waiting" | "running" | "suceeded" | "failed";

    statusMessage?: string;
    statusSuggestion?: string;
    statusCode?: string;
    statusCreatedOn?: string;

    taskType?: "internalApi" | "train" | "infer";
    taskExecutor?: string;
    taskCreatedOn?: string;
    taskLastModifiedOn?: string;

    remoteStatusInput?: string;
    remoteStatusOutput?: string;
    remoteStatusMessage?: string;

    assignedWorker?: string;
    startedAt?: string;

    maxRetries?: number;
    retries?: number;
  };

export type PartialTask = Partial<Task>;
