import SharedQuest from "@/components/share/shared-quest";
import { getNonNullMetadata } from "@/lib/metadata";
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
  let description = searchParams.description as string;
  // optionally access and extend (rather than replace) parent metadata
  const parentMetadata = await getNonNullMetadata(parent);

  const _url = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}`;

  let url = new URL(`${_url}/share/quest/og-image.png`);
  url.searchParams.set("title", searchParams.itemName as string);
  url.searchParams.set("description", description as string);
  url.searchParams.set("itemImage", searchParams.itemImage as string);

  const imageUrl = url.toString();

  return {
    title: (title as string) || "A Quest",
    description: (description as string) || "A Quest",
    openGraph: {
      ...(parentMetadata.openGraph || {}),
      url: _url,
      title: (title as string) || "A Quest",
      description: (description as string) || "A Quest",
      images: imageUrl,
    },
    twitter: {
      creator: "@GetSteamship",
      card: "summary_large_image",
      site: "@GetSteamship",
      title: (title as string) || "A Quest",
      description: (description as string) || "A Quest",
      images: imageUrl,
    },
  };
}

export default function ShareQuest() {
  return <SharedQuest />;
}
