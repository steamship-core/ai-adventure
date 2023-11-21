import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex gap-2 flex-col">
        <Skeleton className="h-[50px] w-[350px]" />
        <Skeleton className="h-[25px] w-[450px]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-[40px] w-[80px]" />
        <Skeleton className="h-[40px] w-[80px]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-[550px] w-[166px]" />
        <Skeleton className="h-[850px] w-full" />
      </div>
    </div>
  );
}
