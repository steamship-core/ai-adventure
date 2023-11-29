import { AdventureDescription } from "@/components/adventures/adventure-description";
import AdventureDetails from "@/components/adventures/adventure-details";
import AdventureTag from "@/components/adventures/adventure-tag";
import CharacterTemplatesSection from "@/components/adventures/character-templates-section";
import EmojiPicker from "@/components/adventures/emoji-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { TypographyLarge } from "@/components/ui/typography/TypographyLarge";
import { getAdventure } from "@/lib/adventure/adventure.server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata(
  {
    params,
  }: {
    params: { adventureId: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const adventure = (await getAdventure(params.adventureId)) as any;

  let ret = { ...(await parent) };

  const url = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/${params.adventureId}`;
  const imageUrl = `/og-image.png?image=${adventure.image}`;

  ret.title = adventure.name;
  ret.description = adventure.shortDescription;
  ret.metadataBase = new URL(url);

  ret.openGraph = {
    ...(ret.openGraph || {}),
    url: url,
    title: adventure.name,
    description: adventure.shortDescription,
    images: adventure.image
      ? [{ url: imageUrl }]
      : [{ url: "/adventurer.png" }],
  };

  ret.twitter = {
    ...(ret.twitter || {}),
    title: adventure.name,
    description: adventure.shortDescription,
    images: adventure.image
      ? [{ url: imageUrl }]
      : [{ url: "/adventurer.png" }],
  } as any;

  return ret as Metadata;
}

export default async function AdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId, ...rest } = auth();

  const adventure = (await getAdventure(params.adventureId)) as any;

  if (!adventure) {
    redirect(`/adventures`);
  }

  const addEmoji = async (formData: FormData) => {
    "use server";
    const id = formData.get("id");
    const emoji = await prisma.emojis.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!emoji) {
      return;
    }

    const existingEmoji = userId
      ? await prisma.reactions.findFirst({
          where: {
            emojiId: emoji.id,
            adventureId: adventure.id,
            userId,
          },
          select: {
            id: true,
          },
        })
      : null;

    if (existingEmoji) {
      await prisma.reactions.delete({
        where: {
          id: existingEmoji.id,
        },
      });
    } else {
      if (userId) {
        await prisma.reactions.create({
          data: {
            emojiId: emoji?.id,
            adventureId: adventure.id,
            userId,
          },
        });
      }
    }
    revalidatePath(`/adventures/${adventure.id}`);
  };

  const reactions = await prisma.reactions.groupBy({
    by: ["emojiId"],
    where: {
      adventureId: adventure.id,
    },
    _count: {
      emojiId: true,
    },
    orderBy: {
      emojiId: "asc",
    },
  });

  const userReactions = userId
    ? await prisma.reactions.groupBy({
        by: ["emojiId"],
        where: {
          adventureId: adventure.id,
          userId,
        },
        _count: {
          emojiId: true,
        },
        orderBy: {
          emojiId: "asc",
        },
      })
    : [];
  const emojis = await prisma.emojis.findMany({});
  const reactionMap = reactions
    .map((reaction) => {
      return {
        id: reaction.emojiId,
        count: reaction._count.emojiId,
      };
    })
    .sort((a, b) => a.id - b.id);

  const userReactionMap = userReactions.map((reaction) => reaction.emojiId);

  const isCreator = adventure.creatorId === userId;
  return (
    <div>
      <div className="relative h-96 w-full mt-2">
        <Image
          src={adventure?.image || "/adventurer.png"}
          fill
          alt="Adventurer"
          className="object-cover rounded-xl"
        />
        <div className="flex justify-between flex-col p-4 gap-2 md:p-6 absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background to-95%">
          <div className="w-full flex justify-between">
            <div />
            {isCreator && (
              <Button variant="outline" asChild>
                <Link href={`/adventures/editor/${params.adventureId}`}>
                  <PencilIcon size={16} className="mr-2" /> Edit
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full justify-start items-start">
            <div className="flex gap-2 flex-wrap">
              {(adventure?.tags || []).map((tag: string) => {
                return <AdventureTag key={tag} tag={tag} />;
              })}
            </div>
            <EmojiPicker
              addEmoji={addEmoji}
              reactions={reactionMap}
              userReactions={userReactionMap}
              emojis={emojis}
            />
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 flex gap-6 flex-col">
        <div>
          <TypographyH1>{adventure.name}</TypographyH1>
          <TypographyLarge className="mt-2 text-xl">
            {adventure.shortDescription}
          </TypographyLarge>
          <AdventureDescription description={adventure.description} />
        </div>
        {adventure.agentConfig ? (
          <>
            <CharacterTemplatesSection adventure={adventure} />
            <AdventureDetails adventure={adventure} />
          </>
        ) : (
          <Alert>
            <AlertTitle>This adventure is not finished yet</AlertTitle>
            <AlertDescription>
              This adventure cannot be played yet. If you&apos; the creator of
              this adventure, update the fields from their default values and
              publish the adventure
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
