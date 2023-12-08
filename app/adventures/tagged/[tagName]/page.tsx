import AdventureList from "@/components/adventures/adventure-list";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import prisma from "@/lib/db";

// set Adventure to features in SQL
export default async function AdventurePage({
  params,
}: {
  params: { tagName: string };
}) {
  const emojis = await prisma.emojis.findMany({});

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col justify-between">
        <TypographyH2 className="border-none">
          Adventures tagged &quot;{params.tagName}&quot;
        </TypographyH2>
        <TypographyMuted className="text-lg">
          Adventures created by the community
        </TypographyMuted>
      </div>
      <AdventureList emojis={emojis} tagName={params.tagName} />
    </div>
  );
}
