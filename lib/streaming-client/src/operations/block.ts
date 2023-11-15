import { Block, Client, IBlockClient } from "../schema";

export class BlockClient implements IBlockClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Fetch the raw content of the block.
   *
   * @param params
   * @param client
   */
  public async raw(params: { id: string }): Promise<Response> {
    return await this.client.get(`block/${params.id}/raw`, {});
  }

  /**
   * Fetch the raw content of the block.
   *
   * @param params
   * @param client
   */
  public async get(params: { id: string }): Promise<Block> {
    try {
      let response = await this.client.post(`block/get`, { id: params.id });
      let json = await response.json();
      const block = (json?.block || json?.data?.block) as Block;
      if (!block) {
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        await delay(5000);
        let response = await this.client.post(`block/get`, { id: params.id });
        let json = await response.json();
        console.log("JJJ", json);
        return (json?.block || json?.data?.block) as Block;
      }
      return block;
    } catch (ex) {
      // Wait for 2s
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      await delay(5000);
      let response = await this.client.post(`block/get`, { id: params.id });
      let json = await response.json();
      return (json?.block || json?.data?.block) as Block;

      console.log(ex);
      // throw ex
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default BlockClient;
