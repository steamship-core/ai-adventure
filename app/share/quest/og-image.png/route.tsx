/*
 * This page returns an IMAGE.
 *
 * The URL to be shared on social media is one level up: `/share/quest?args`
 * That page will use an image generated from this page.
 */
import { ImageResponse } from "next/server";

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
  let imageUrl = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/share-card-404.png`;
  let itemTitle = `Unknown Item`;
  let itemDescription = `An item of unknown origin.`;
  // Override with the real data.

  const itemImage = `${searchParams.get("itemImage")}`;
  if (itemImage) {
    imageUrl = itemImage as string;
  }

  const _title = `${searchParams.get("title")}`;
  if (_title) {
    itemTitle = _title;
  }

  const _description = `${searchParams.get("description")}`;
  if (_description) {
    itemDescription = _description;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          color: "black",
          width: TWITTER_WIDTH,
          height: TWITTER_HEIGHT,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          style={{
            height: "80%",
            borderRadius: 10,
          }}
          alt={itemTitle}
        />
        <div
          style={{
            display: "flex",
            paddingLeft: "20px",
            paddingRight: "12px",
            color: "black",
            width: TEXT_WIDTH,
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              marginBottom: 2,
              fontWeight: "bolder",
            }}
          >
            {itemTitle}
          </h1>
          <p
            style={{
              fontSize: 24,
              maxWidth: "100%",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 9,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {itemDescription}
          </p>
        </div>
      </div>
    ),
    {
      width: TWITTER_WIDTH,
      height: TWITTER_HEIGHT,
    }
  );
}
