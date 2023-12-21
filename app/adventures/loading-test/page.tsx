import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";

export default async function AdventuresCreateLoadingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex justify-between flex-col md:flex-row">
        <div className="mb-4 md:mb-0">
          <TypographyH1 className="border-none">
            Discover Adventures
          </TypographyH1>
          <TypographyMuted className="text-lg">
            Adventures created by the community
          </TypographyMuted>
        </div>
      </div>

      <Skeleton className="rounded-md w-full h-[44px]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((adventureTemplate) => (
          <Skeleton
            key={adventureTemplate}
            className="rounded-md w-full h-[310px]"
          />
        ))}
      </div>
    </div>
  );
}
