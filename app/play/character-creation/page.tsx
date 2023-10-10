import CharacterCreation from "@/components/character-creation";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function CharacterCreationPage() {
  const { userId } = auth();

  // const agent = await prisma.agents.findFirst({
  //   where: {
  //     ownerId: userId!,
  //   },
  // });

  // if (agent) {
  //   redirect("/play/camp");
  // }

  return <CharacterCreation />;
}
