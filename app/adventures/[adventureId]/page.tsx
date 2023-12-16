import AdventureTag from "@/components/adventures/adventure-tag";
import EmojiPicker from "@/components/adventures/emoji-picker";
import { StartAdventureSection } from "@/components/adventures/start-adventure-section";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { getAdventure } from "@/lib/adventure/adventure.server";
import prisma from "@/lib/db";
import { getNonNullMetadata } from "@/lib/metadata";
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
  const ret = await getNonNullMetadata(parent);

  const url = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventures/${params.adventureId}`;
  let imageUrl = adventure.image;

  if (imageUrl?.endsWith("/raw")) {
    // The Steamship engine will ignore the filename.. but the .png extension is required for Twitter to realize it's an image.
    imageUrl = `${imageUrl}/image.png`;
  }

  // Now, finally, we dynamically render the image.
  let shareImageUrl = new URL(`${url}/og-image.png`);
  shareImageUrl.searchParams.set("itemImage", imageUrl as string);

  imageUrl = shareImageUrl.toString();

  ret.title = adventure.name;
  ret.description = adventure.shortDescription;
  ret.metadataBase = new URL(url);

  ret.openGraph = {
    ...(ret.openGraph || {}),
    url: url,
    title: adventure.name,
    description: adventure.shortDescription,
    images: adventure.image
      ? [{ url: shareImageUrl }]
      : [{ url: "/adventurer.png" }],
  };

  ret.twitter = {
    ...(ret.twitter || {}),
    title: adventure.name,
    description: adventure.shortDescription,
    images: adventure.image
      ? [{ url: shareImageUrl }]
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

  const adventure = await getAdventure(params.adventureId);

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
  const ownerUserInfo = await prisma.userInfo.findUnique({
    where: {
      userId: adventure.creatorId,
    },
  });
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
                return <AdventureTag key={tag} tag={tag} isLink />;
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
      <StartAdventureSection
        adventure={adventure}
        ownerUserInfo={ownerUserInfo}
      />
      <div className="mt-8">
        <TypographyH3>Snippets from this adventure</TypographyH3>
        <TypographyMuted>
          These are snippets that have been shared by other adventurers.
        </TypographyMuted>
        {adventure?.NarrativeSnippet.length === 0 && (
          <div className="w-full mt-8 text-center">
            <TypographyMuted>
              There are no snippets for this adventure yet.
            </TypographyMuted>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {adventure?.NarrativeSnippet.map((snippet) => (
            <div
              key={snippet.id}
              className="border rounded-md text-md text-muted-foreground flex items-center justify-center text-center"
            >
              <span className="line-clamp-5 italic p-2">{snippet.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
