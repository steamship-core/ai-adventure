"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

export const AdventureDescription = ({
  description,
}: {
  description: string;
}) => {
  const [isClamped, setIsClamped] = useState(true);

  return (
    <div className="relative inline">
      <TypographyMuted
        className={cn(
          "mt-2 text-xl whitespace-break-spaces",
          isClamped && "line-clamp-2"
        )}
      >
        {description}
      </TypographyMuted>
      <button
        className="text-primary text-lg hover:underline"
        onClick={() => setIsClamped((c) => !c)}
      >
        View {isClamped ? "more" : "less"}
      </button>
    </div>
  );
};
