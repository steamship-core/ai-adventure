export const levels = [
  "Wayfarer",
  "Novice Explorer",
  "Journeyman Adventurer",
  "Quest Seeker",
  "Dungeon Delver",
  "Ruin Raider",
  "Treasure Hunter",
  "Dragon Slayer",
  "Mage's Acolyte",
  "Mystic Seer",
  "Arcane Master",
  "Elemental Bender",
  "Celestial Caller",
  "Beast Tamer",
  "Nature's Whisperer",
  "Shadow Stalker",
  "Night's Veil",
  "Sun's Champion",
  "Lunar Guardian",
  "Starlight Wanderer",
  "Rune Caster",
  "Eldritch Scholar",
  "Enigma Solver",
  "Cipher Breaker",
  "Truth Seeker",
  "Fate's Hand",
  "Destiny Shaper",
  "Time Weaver",
  "Realm Walker",
  "Portal Jumper",
  "Abyss Watcher",
  "Horizon Strider",
  "Cosmic Voyager",
  "Galaxy Drifter",
  "Celestial Nomad",
  "Phantom Hunter",
  "Spectral Warden",
  "Ghost Whisperer",
  "Spirit Guide",
  "Soul Binder",
  "Warlord",
  "Battle Scarred",
  "Champion of the Arena",
  "Gladiator",
  "Valiant Knight",
  "Noble Paladin",
  "Dark Assassin",
  "Silent Executioner",
  "Rogue Thief",
  "Cunning Strategist",
  "Forest Sentinel",
  "Mountain's Embrace",
  "Desert Nomad",
  "Ocean's Chosen",
  "Thunder's Herald",
  "Flame Wielder",
  "Ice Shaper",
  "Earth Mover",
  "Wind Dancer",
  "Void Caller",
  "Eldertree Guardian",
  "Swamp Mystic",
  "Cavern Dweller",
  "Sky Breaker",
  "Legendary Artisan",
  "Master Blacksmith",
  "Elixir Brewer",
  "Enchanted Crafter",
  "Gear Tinkerer",
  "Scroll Scribe",
  "Runestone Carver",
  "Totem Maker",
  "Sigil Painter",
  "Talisman Forger",
  "Mythical Beast Rider",
  "Kraken Subduer",
  "Serpent Charmer",
  "Griffin's Ally",
  "Phoenix Friend",
  "Lore Keeper",
  "Saga Singer",
  "Fable Weaver",
  "Tale Spinner",
  "Legend Crafter",
  "Parable Narrator",
  "Kingdom's Defender",
  "Empire's Heart",
  "Tribe's Pride",
  "Clan's Honor",
  "Order's Beacon",
  "Chaos Bringer",
  "Balance Restorer",
  "Prophecy Foreteller",
  "Omens Reader",
  "Stars' Interpreter",
  "Twilight's Envoy",
  "Dawn's Harbinger",
  "Dusk's Emissary",
  "Aurora's Muse",
  "Ethereal Dreamer",
];

const RANKS_PER_LEVEL = 2;
// Returns a number between 1 - LEVELS_PER_RANK
export const getRankProgress = (rank: number) => {
  return (((rank - 1) % RANKS_PER_LEVEL) / RANKS_PER_LEVEL) * 100;
};

export const getRanksUntilNextLevel = (rank: number) => {
  return RANKS_PER_LEVEL - ((rank - 1) % RANKS_PER_LEVEL);
};

export const getLevel = (rank: number) => {
  try {
    if (rank === 1) {
      levels[0];
    }
    const level = Math.ceil(rank / RANKS_PER_LEVEL);
    if (level > 99) {
      return "Unknown";
    }
    return levels[Math.ceil(rank / RANKS_PER_LEVEL)];
  } catch (e) {
    return "Unknown";
  }
};
