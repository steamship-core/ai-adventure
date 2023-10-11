import Quest from "@/components/quest/quest";
import prisma from "@/lib/db";
import { getGameState } from "@/lib/game/game-state";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function QuestPage() {
  const { userId } = auth();

  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (!agent) {
    redirect("/play/character-creation");
  }

  const gameState = await getGameState(agent?.agentUrl);

  return <Quest gameState={gameState} />;
}
