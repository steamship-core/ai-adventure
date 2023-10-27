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
const OUTER_PAD_Y = 25;

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
          background: "#f6f6f6",
          width: TWITTER_WIDTH,
          height: TWITTER_HEIGHT,
          paddingTop: OUTER_PAD_Y,
          paddingBottom: OUTER_PAD_Y,
          paddingLeft: OUTER_PAD_X,
          paddingRight: OUTER_PAD_X,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          width={ITEM_EMBED_SIZE}
          height={ITEM_EMBED_SIZE}
          src={imageUrl}
          style={{
            border: "1px solid #363636",
            background: "#d6d6d6",
            paddingTop: ITEM_PAD,
            paddingBottom: ITEM_PAD,
            paddingLeft: ITEM_PAD,
            paddingRight: ITEM_PAD,
            marginTop: ITEM_PAD,
            marginBottom: ITEM_PAD,
            marginLeft: ITEM_PAD,
            marginRight: ITEM_PAD,
          }}
        />
        <div
          style={{
            display: "flex",
            paddingTop: ITEM_PAD * 2,
            marginTop: ITEM_PAD,
            paddingLeft: ITEM_PAD,
            paddingBottom: ITEM_PAD,
            marginBottom: ITEM_PAD,
            color: "black",
            width: TEXT_WIDTH,
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: 36,
              marginBottom: 10,
              marginTop: 10,
              fontWeight: "bolder",
            }}
          >
            {itemTitle}
          </div>
          <div
            style={{
              fontSize: 24,
              marginBottom: 10,
              height: 180,
              maxWidth: "100%",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 5,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            className="bg-red"
          >
            {itemDescription}
          </div>
        </div>
      </div>
    ),
    {
      width: TWITTER_WIDTH,
      height: TWITTER_HEIGHT,
    }
  );
}
