import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import prisma from "@/lib/db";
import { SignOutButton, UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  const agent = await prisma.agents.findFirst({
    where: {
      ownerId: userId!,
    },
  });

  if (agent) {
    redirect("/play/camp");
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center p-6 md:p-24">
      <TypographyH1>AI Adventure</TypographyH1>
      <div className="flex flex-col mt-8">
        <Button asChild>
          <Link href="/play/character-creation">Create Character</Link>
        </Button>
        <LogoutButton />
      </div>
    </main>
  );
}
