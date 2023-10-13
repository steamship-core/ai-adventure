import { IsSteamshipModel } from "./util";
import { HasHandle } from "@steamship/client";

/**
 * User
 *
 * A user in Steamship.
 *
 */
export type User = IsSteamshipModel & HasHandle;

export type PartialUser = Partial<User>;

export interface IUserClient {
  current(): Promise<User>;
}
