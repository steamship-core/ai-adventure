import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";

// set Adventure to features in SQL
export default async function AdventuresPage() {
  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col justify-between">
        <TypographyH2 className="border-none">Rank Progress</TypographyH2>
        <TypographyMuted className="text-lg">
          Adventures created by the community
        </TypographyMuted>
      </div>
    </div>
  );
}
