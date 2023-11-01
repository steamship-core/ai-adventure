import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getAdventures } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import Image from "next/image";
import Link from "next/link";

export default async function AdventuresPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventures = await getAdventures();

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adventures.map((adventure) => (
          <Link
            key={adventure.id}
            href={`/adventures/${adventure.id}`}
            className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
          >
            <div className="relative aspect-video ">
              <Image
                src={adventure.image || "/adventurer.png"}
                fill
                alt="Adventurer"
              />
            </div>
            <div className="pb-2 px-4 flex flex-col">
              <div>
                <TypographySmall className="text-muted-foreground">
                  Quest
                </TypographySmall>
                <TypographyLarge>
                  {adventure.name || "Epic Quest"}
                </TypographyLarge>
              </div>
              <div>
                <TypographySmall className="text-muted-foreground">
                  Description
                </TypographySmall>
                <TypographyLarge className="line-clamp-3">
                  {adventure.description}
                </TypographyLarge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
