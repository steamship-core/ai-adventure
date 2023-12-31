export type Item = {
  id: string;
  name?: string;
  description?: string;
  is_one_time_use?: boolean;

  /**  Modifier is a placeholder for the future. The game settings can assigne int->String values like "mythic", etc.
   *
   *
   */
  modifier?: number;
  picture_url?: string;
};
