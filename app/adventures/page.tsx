import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { log } from "next-axiom";

export default async function CampPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const likes = 100;
  const { rows } =
    await sql`SELECT * FROM "Agents" WHERE "ownerId" = ${userId};`;
  console.log(rows);
  return (
    <div>
      <TypographyH1>Adventures</TypographyH1>
      {/* {agents.map((agent) => (
        <div key={agent.agentUrl}>{agent.agentUrl}</div>
      ))} */}
    </div>
  );
}
