"use client";

import { SmilePlusIcon } from "lucide-react";
import millify from "millify";
import { useState } from "react";

const EmojiPicker = ({
  addEmoji,
  reactions,
  userReactions,
}: {
  addEmoji: (formData: FormData) => Promise<void>;
  reactions: {
    id: number;
    count: number;
  }[];
  userReactions: number[];
}) => {
  const [open, isOpen] = useState(false);
  const emojis = [
    {
      id: 29,
      emoji: "🤣",
    },
    {
      id: 30,
      emoji: "😍",
    },
    {
      id: 31,
      emoji: "😢",
    },
    {
      id: 32,
      emoji: "😎",
    },
    {
      id: 33,
      emoji: "😳",
    },
    {
      id: 34,
      emoji: "😃",
    },
    {
      id: 35,
      emoji: "❤️",
    },
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => isOpen((o) => !o)}
        className="rounded-full bg-foreground/80 p-2 hover:bg-foreground"
      >
        <SmilePlusIcon size={16} className="text-background" />
      </button>
      <div className="flex items-center justify-center gap-2">
        {!open &&
          reactions.map(({ id, count }) => (
            <form
              action={addEmoji}
              key={id}
              className="flex gap-2 items-center justify-center px-2 rounded-full bg-background/90 border border-transparent hover:cusor-pointer hover:border-indigo-600"
            >
              <input type="hidden" name="id" value={id} />
              <button type="submit">
                {emojis.find((emoji) => emoji.id === id)?.emoji}
              </button>
              <div className="text-sm">
                {millify(reactions.find((r) => r.id === id)?.count || 0)}
              </div>
            </form>
          ))}
        {open &&
          emojis.map(({ emoji, id }) => (
            <form
              action={addEmoji}
              key={emoji}
              className="flex gap-2 items-center justify-center px-2 rounded-full bg-background/90 border border-transparent hover:cusor-pointer hover:border-indigo-600"
            >
              <input type="hidden" name="id" value={id} />
              <button type="submit">{emoji}</button>{" "}
              <div className="text-sm">
                {millify(reactions.find((r) => r.id === id)?.count || 0)}
              </div>
            </form>
          ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
