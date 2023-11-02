import AdventureList from "@/components/adventures/adventure-list";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
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
      <TypographyH1>AI Adventures</TypographyH1>
      {/* <div>
        <CreateAdventureButton />
      </div> */}
      <div>
        <TypographyH2 className="border-none">Find an Adventure</TypographyH2>
        <TypographyMuted className="text-lg">
          Discover adventures created by the community
        </TypographyMuted>
      </div>
      <AdventureList />
    </div>
  );
}
