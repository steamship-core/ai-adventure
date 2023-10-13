import { PackageInstance } from "./package";
import { Task } from "./task";
import { File } from "./file";
import { Client } from "./client";
import { Block } from "./block";

/**
 * Agent Instance.
 *
 * Agent Instances are instances of AI agents running in the cloud.
 *
 */
export type AgentInstance = PackageInstance;

export type NonStreamingResponse = Block[];

export type StreamingResponse = {
  task: Task;
  file: File;
};

type AgentRespondParams = {
  /**
   * The base URL of the running agent instance.
   */
  url: string;

  /**
   * Input for the agent.
   */
  input: {
    /**
     * The new user message to respond to.
     */
    prompt: string;

    /**
     * The ID of the conversation context for conversation history retrieval.
     */
    context_id: string;
  };
};

export type AgentPostGetParams = {
  /**
   * The base URL of the running agent instance.
   */
  url: string;

  /**
   * The method to invoke
   */
  path: string;

  /**
   * Input for the agent.
   */
  arguments: Record<string, any>;
};

export type { AgentRespondParams };

export interface IAgentClient {
  post(params: AgentPostGetParams): Promise<Response>;
  respond(params: AgentRespondParams): Promise<Block[]>;
  respondAsync(params: AgentRespondParams): Promise<StreamingResponse>;
}
