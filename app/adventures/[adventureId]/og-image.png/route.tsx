/*
 * This page returns an IMAGE.
 */
import { getAdventure } from "@/lib/adventure/adventure.server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const TWITTER_WIDTH = 800;
const TWITTER_HEIGHT = 418;
const OUTER_PAD_X = 35;

const ITEM_EMBED_SIZE = 300; // Has to be less than TWITTER-HEIGHT - 2 * OUTER_PAD - IMAGE_PAD
const ITEM_PAD = 9;
const TEXT_WIDTH =
  TWITTER_WIDTH - ITEM_EMBED_SIZE - 2 * OUTER_PAD_X - 2 * ITEM_PAD;

export default async function GET({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventure = (await getAdventure(params.adventureId)) as any;

  let imageUrl = adventure.image;
  if (imageUrl?.endsWith("/raw")) {
    // The Steamship engine will ignore the filename.. but the .png extension is required for Twitter to realize it's an image.
    imageUrl = `${imageUrl}/image.png`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          color: "black",
          backgroundColor: "white",
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
          alt={adventure.name}
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
            {adventure.name}
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
            {adventure.shortDescription}
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
