import { Item } from "./objects";

export type Quest = {
  /** The originating string that was used to generate the Quest. */
  originating_string?: string;

  /** The name of the quest. AI Generated from the originating_string. */
  name?: string;

  /** The description of the quest. */
  description?: string;

  /** The ChatFile ID of the quest. */
  chat_file_id?: string;

  /** An image of this quest generated afterwards by AI. */
  image_url?: string;

  /** A summary of the quest generated afterwards. */
  text_summary?: string;

  /** Any new items the player got while on the quest. */
  new_items?: Item[];

  /** The change in rank that resulted from this quest. */
  rank_delta?: number;
};
