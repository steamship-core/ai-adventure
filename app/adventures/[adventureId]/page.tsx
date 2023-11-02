import BackButton from "@/components/adventures/back-button";
import CharacterTemplatesSection from "@/components/adventures/character-templates-section";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();
  if (!userId) throw new Error("no user");

  const adventure = (await getAdventure(params.adventureId)) as any;

  if (!adventure) {
    redirect(`/adventures`);
  }

  return (
    <div>
      <div className="relative h-96 w-full">
        <Image
          src={adventure?.agentConfig?.image || "/adventurer.png"}
          fill
          alt="Adventurer"
          className="object-cover"
        />
        <div className="flex justify-between flex-col p-4 gap-2 md:p-6 absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background">
          <div className="w-full flex justify-between">
            <BackButton />
            {adventure.creatorId === userId && (
              <Button variant="outline" asChild>
                <Link href={`/adventures/editor/${params.adventureId}`}>
                  <PencilIcon size={16} className="mr-2" /> Edit
                </Link>
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {(adventure?.agentConfig?.adventure_tags || []).map(
              (tag: string) => {
                return (
                  <div
                    key={tag}
                    className="bg-indigo-600 rounded-full text-sm px-2"
                  >
                    {tag}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 flex gap-6 flex-col">
        <div>
          <TypographyH1>{adventure.name}</TypographyH1>
          <TypographyLarge className="mt-2 text-2xl">
            {adventure.shortDescription}
          </TypographyLarge>
          <TypographyMuted className="mt-2 text-2xl">
            {adventure.description}
          </TypographyMuted>
        </div>
        <CharacterTemplatesSection
          adventureId={params.adventureId}
          playerSingularNoun={
            adventure?.agentConfig?.adventure_player_singular_noun
          }
        />
      </div>
    </div>
  );
}
