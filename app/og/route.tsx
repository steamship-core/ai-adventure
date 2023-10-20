import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get("blockId");

  return new ImageResponse(
    (
      <img
        width="512"
        height="512"
        src={`https://api.staging.steamship.com/api/v1/block/${blockId}/raw`}
      />
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
