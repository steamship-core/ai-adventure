/**
 * Parameters for creating an instance of an agent.
 *
 */
import { Client } from "../schema";
import { IUserClient, User } from "../schema/user";

export class UserClient implements IUserClient {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async current(): Promise<User> {
    let response = await this.client.get(`account/current`, {});
    let json = await response.json();
    return json?.data?.user as User;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default UserClient;
