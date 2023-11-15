/*
 * This page returns an IMAGE.
 *
 * The URL to be shared on social media is one level up: `/share/quest?args`
 * That page will use an image generated from this page.
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";

const TWITTER_WIDTH = 800;
const TWITTER_HEIGHT = 418;
const OUTER_PAD_X = 35;

const ITEM_EMBED_SIZE = 300; // Has to be less than TWITTER-HEIGHT - 2 * OUTER_PAD - IMAGE_PAD
const ITEM_PAD = 9;
const TEXT_WIDTH =
  TWITTER_WIDTH - ITEM_EMBED_SIZE - 2 * OUTER_PAD_X - 2 * ITEM_PAD;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Defaults.
  let imageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/adventurer.png`;
  // Override with the real data.

  const image = `${searchParams.get("image")}`;
  if (image) {
    imageUrl = image as string;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return new ImageResponse(<img src={imageUrl} alt="Image" />, {
    width: TWITTER_WIDTH,
    height: TWITTER_HEIGHT,
  });
}
