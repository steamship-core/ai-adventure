// GET raw data from block
import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        👋 Hello
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// const GET = async (req: Request, context: { params: any }) => {
//   // console.log("HI");
//   // const blockId = context.params.blockId;
//   // console.log(blockId);
//   // log.info(`/api/block/${blockId}`);
//   // const steamship = getSteamshipClient();
//   // log.info(`client config ${JSON.stringify(steamship.config)}`);
//   // const response = await steamship.block.raw({ id: blockId });
//   // log.info(`response ok ${response.ok}`);
//   // return response;
// };

// export { GET };
