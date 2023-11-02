import { CreateAdventureButton } from "@/components/adventures/create-adventure-button";
import { TypographyH2 } from "@/components/ui/typography/TypographyH2";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import { getAdventuresForUser } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { log } from "next-axiom";
import Image from "next/image";
import Link from "next/link";

export default async function AdventuresPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }
  const adventureTemplates = await getAdventuresForUser(userId);

  return (
    <div className="flex flex-col gap-6 p-4 px-4 md:px-6 py-8">
      <div className="flex justify-between">
        <div>
          <TypographyH2 className="border-none">
            Build your own adventure
          </TypographyH2>
          <TypographyMuted className="text-lg">
            Build a new adventure, or edit an adventure template you have
            already created
          </TypographyMuted>
        </div>
        {adventureTemplates.length !== 0 && <CreateAdventureButton />}
      </div>
      {adventureTemplates.length === 0 && (
        <div className="w-full flex items-center flex-col my-12  gap-6">
          <div className="text-center">
            <TypographyLarge>Create your first adventure</TypographyLarge>
            <TypographyMuted className="mt-2">
              Fully customize your adventure, <br />
              and share it with the world!
            </TypographyMuted>
          </div>
          <CreateAdventureButton />
        </div>
      )}
      {adventureTemplates.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {adventureTemplates.map((adventureTemplate) => (
              <Link
                key={adventureTemplate.id}
                href={`/adventures/${adventureTemplate.id}`}
                className="rounded-md border-foreground/20 border overflow-hidden hover:border-indigo-600"
              >
                <div className="p-4 flex flex-col gap-4 bg-muted">
                  <div>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        src={adventureTemplate.image || "/adventurer.png"}
                        fill
                        alt="Adventurer"
                      />
                    </div>
                  </div>
                  <div>
                    <TypographyLarge>
                      {adventureTemplate.name || "Epic Quest"}
                    </TypographyLarge>
                    <TypographyMuted className="line-clamp-1">
                      {adventureTemplate.description ||
                        "An epic quest filled with danger and adventure"}
                    </TypographyMuted>
                  </div>
                </div>
                <div className=" p-4 flex flex-col">
                  <div>
                    <TypographySmall className="text-muted-foreground">
                      Created at
                    </TypographySmall>
                    <TypographyLarge>
                      {format(adventureTemplate.createdAt, "MMM d, yyyy")}
                    </TypographyLarge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}