import AdventureList from "@/components/adventures/adventure-list";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Adventures - AI Adventure",
  description:
    "Discover adventures created by the community and embark on your storytelling journey.",
};

// set Adventure to features in SQL
export default async function AdventuresPage() {
  const emojis = await prisma.emojis.findMany({});

  return (
    <>
      <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
        <div className="flex flex-col justify-between">
          <TypographyH1 className="border-none">
            Discover Adventures
          </TypographyH1>
          <TypographyMuted className="text-lg">
            Adventures created by the community
          </TypographyMuted>
        </div>
        <AdventureList emojis={emojis} />
      </div>
    </>
  );
}
