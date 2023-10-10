import { GameState, HumanCharacter, Quest } from "./game-state";

export const mockPlayer: HumanCharacter = {
  name: "Testy McTesterson",
  description: "A test player, for testing",
  background: "Born in the land of testing, Testy is a test player",
  inventory: [],
  motivation: "To test everything in the game",
  rank: 1,
  gold: 42,
  energy: 98,
};

const mockQuest: Quest = {
  originating_string: "Testy McTesterson",
  name: "Test Quest",
  description: "A test quest, for testing",
  chat_file_id: "test",
  image_url: "https://picsum.photos/1024/1024",
  text_summary: "Test quest summary",
  new_items: [],
  rank_delta: 1,
  camp: {
    name: "Test Camp",
    npcs: [],
    human_players: [],
    chat_file_id: "test",
  },
};

export const mockGameState: GameState = {
  player: mockPlayer,
  tone: "Silly",
  genre: "Fantasy",
  quests: [],
  camp: {
    name: "Test Camp",
    npcs: [],
    human_players: [],
    chat_file_id: null,
  },
  in_conversation_with: null,
  await_ask_key: null,
  current_quest: null,
};
