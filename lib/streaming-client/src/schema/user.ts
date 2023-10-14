import { HasHandle } from "@/lib/streaming-client/src";
import { IsSteamshipModel } from "./util";

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
