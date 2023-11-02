import AdventureList from "@/components/adventures/adventure-list";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";

export default async function AdventuresPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex flex-col justify-between">
        <TypographyH2 className="border-none">Discover Adventures</TypographyH2>
        <TypographyMuted className="text-lg">
          Discover adventures created by the community
        </TypographyMuted>
      </div>
      <AdventureList />
    </div>
  );
}
