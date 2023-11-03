import { cn } from "@/lib/utils";

const AdventureTag = ({ tag }: { tag: string }) => {
  return (
    <div
      key={tag}
      className={cn(
        "bg-gray-600 rounded-full text-sm px-2",
        tag === "fantasy" && "bg-green-600",
        tag === "sci-fi" && "bg-blue-600",
        tag === "horror" && "bg-red-600",
        tag === "mystery" && "bg-yellow-600",
        tag === "comedy" && "bg-pink-600",
        tag === "romance" && "bg-purple-600",
        tag === "action" && "bg-orange-600",
        tag === "drama" && "bg-teal-600",
        tag === "thriller" && "bg-red-800",
        tag === "western" && "bg-emerald-600",
        tag === "adventure" && "bg-cyan-600",
        tag === "historical" && "bg-fuchsia-600",
        tag === "crime" && "bg-rose-600",
        tag === "animation" && "bg-lime-600",
        tag === "documentary" && "bg-blue-800",
        tag === "war" && "bg-rose-800",
        tag === "sport" && "bg-sky-400",
        tag === "modern-day" && "bg-sky-600"
      )}
    >
      {tag}
    </div>
  );
};

export default AdventureTag;
