import { Skeleton } from "@/components/ui/skeleton";

export default async function AdventuresCreateLoadingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <Skeleton className="rounded-md w-full h-44" />
      <Skeleton className="rounded-md w-full h-96" />
      <Skeleton className="rounded-md w-20 h-10" />
    </div>
  );
}
