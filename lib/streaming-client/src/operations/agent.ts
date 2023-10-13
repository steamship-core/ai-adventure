/**
 * Parameters for creating an instance of an agent.
 *
 */
import { Block, Client } from "../schema";
import {
  IAgentClient,
  AgentPostGetParams,
  StreamingResponse,
  AgentRespondParams,
  AgentInstance,
} from "../schema";

export class AgentClient implements IAgentClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Respond to the provided input asynchronously, returning a Task representing completion and a File object
   * in which the response will be asynchronously streamed.
   *
   * @param params
   */
  public async respondAsync(
    params: AgentRespondParams
  ): Promise<StreamingResponse> {
    const resp = await this.client.package.invoke({
      base_url: params.url,
      method: "async_prompt",
      payload: params.input,
      verb: "POST",
    });
    const json = await resp.json();
    return json as StreamingResponse;
  }

  /**
   * Respond to the provided input synchronously, returning a list of Block objects.
   *
   * @param params
   */
  public async respond(params: AgentRespondParams): Promise<Block[]> {
    const resp = await this.client.package.invoke({
      base_url: params.url,
      method: "prompt",
      payload: params.input,
      verb: "POST",
    });
    const json = await resp.json();
    return json as Block[];
  }

  /**
   * Respond to the provided input synchronously, returning a list of Block objects.
   *
   * @param params
   */
  public async post(params: AgentPostGetParams): Promise<Response> {
    return await this.client.package.invoke({
      base_url: params.url,
      method: params.path,
      payload: params.arguments,
      verb: "POST",
    });
  }

  /**
   * Respond to the provided input synchronously, returning a list of Block objects.
   *
   * @param params
   */
  public async get(params: AgentPostGetParams): Promise<Response> {
    return await this.client.package.invoke({
      base_url: params.url,
      method: params.path,
      verb: "GET",
    });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default AgentClient;
