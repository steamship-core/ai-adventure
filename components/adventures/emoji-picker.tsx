"use client";

import { cn, emojis } from "@/lib/utils";
import { SmilePlusIcon } from "lucide-react";
import millify from "millify";
import { useRef, useState } from "react";

const EmojiForm = ({
  action,
  emoji,
  id,
  count,
  isSelected = false,
  optimisticUpdate,
}: {
  action: (formData: FormData) => Promise<void>;
  emoji: string;
  id: number;
  count: number;
  isSelected?: boolean;
  optimisticUpdate: (id: number) => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={action}
      className={cn(
        "flex gap-2 items-center justify-center px-2 rounded-full bg-background/90 border border-transparent hover:cursor-pointer hover:border-indigo-600",
        isSelected && "bg-foreground/80 text-background"
      )}
      onClick={(e) => {
        // submit form
        ref.current?.requestSubmit();
        optimisticUpdate(id);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          e.stopPropagation();
          optimisticUpdate(id);
        }}
      >
        {emoji}
      </button>
      <div className="text-sm">{millify(count)}</div>
    </form>
  );
};

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
  console.log(userReactions);
  const [optimisticUserReactions, setOptimisticUserReactions] =
    useState(userReactions);
  const [optimisiticReactions, setOptimisticReactions] = useState(reactions);
  const [open, isOpen] = useState(false);

  const optimisticUpdate = (id: number) => {
    console.log("optimisiticReactions", optimisiticReactions, id);
    if (optimisticUserReactions.includes(id)) {
      setOptimisticReactions((reactions) =>
        reactions.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              count: r.count - 1,
            };
          }
          return r;
        })
      );
      setOptimisticUserReactions((reactions) =>
        reactions.filter((r) => r !== id)
      );
    } else {
      setOptimisticReactions((reactions) => {
        const reaction = reactions.find((r) => r.id === id);
        if (!reaction) {
          return [...reactions, { id, count: 1 }].sort((a, b) => a.id - b.id);
        }
        return reactions.map((r) => {
          if (r.id === id) {
            console.log("modifying count");
            return {
              ...r,
              count: (r.count || 0) + 1,
            };
          }
          return r;
        });
      });
      setOptimisticUserReactions((reactions) => [...reactions, id]);
    }
  };

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
          optimisiticReactions.map(({ id, count }) => (
            <EmojiForm
              id={id}
              count={optimisiticReactions.find((r) => r.id === id)?.count || 0}
              action={addEmoji}
              key={id}
              emoji={emojis.find((emoji) => emoji.id === id)?.emoji || ""}
              isSelected={optimisticUserReactions.includes(id)}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
        {open &&
          emojis.map(({ emoji, id }) => (
            <EmojiForm
              action={addEmoji}
              key={emoji}
              id={id}
              emoji={emoji}
              count={optimisiticReactions.find((r) => r.id === id)?.count || 0}
              isSelected={optimisticUserReactions.includes(id)}
              optimisticUpdate={optimisticUpdate}
            />
          ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
