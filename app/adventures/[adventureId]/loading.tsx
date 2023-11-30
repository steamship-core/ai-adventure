import { Skeleton } from "@/components/ui/skeleton";

export default async function AdventuresCreateLoadingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-10 w-44" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
