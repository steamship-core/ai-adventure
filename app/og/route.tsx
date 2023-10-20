import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get("blockId");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          width="512"
          height="512"
          src={`https://api.staging.steamship.com/api/v1/block/${blockId}/raw`}
          style={{
            borderRadius: 128,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
