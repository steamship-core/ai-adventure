import SharedQuest from "@/components/share/shared-quest";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const title = searchParams.title;
  const description = searchParams.description;
  const blockId = searchParams.blockId;
  // optionally access and extend (rather than replace) parent metadata
  const parentMetadata = (await parent) || {};

  return {
    title: (title as string) || "A Quest",
    description: (description as string) || "A Quest",
    openGraph: {
      ...(parentMetadata.openGraph || {}),
      url: "https://ai-adventure.steamship.com/",
      images: `/api/block/${blockId}/asset.png`,
      title: (title as string) || "A Quest",
      description: (description as string) || "A Quest",
    },
    twitter: {
      creator: "@GetSteamship",
      card: "summary_large_image",
      site: "@GetSteamship",
      title: (title as string) || "A Quest",
      description: (description as string) || "A Quest",
      images: `/api/block/${blockId}/asset.png`,
    },
  };
}

export default function ShareQuest() {
  return <SharedQuest />;
}
