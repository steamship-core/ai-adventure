import CharacterCreation from "@/components/character-creation";
import { getAgent } from "@/lib/agent/agent.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export default async function CharacterCreationPage({
  params,
}: {
  params: { handle: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId, params.handle);

  if (!agent) {
    log.error("No agent");
    redirect(`/adventures`);
  }
  return <CharacterCreation isDevelopment={agent.isDevelopment || false} />;
}
