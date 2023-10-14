import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { getAgent } from "@/lib/agent/agent.server";
import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PlayPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const agent = await getAgent(userId);

  if (agent) {
    redirect("/play/camp");
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center p-6 md:p-24">
      <TypographyH1>AI Adventure</TypographyH1>
      <div className="flex flex-col mt-8">
        <Button asChild>
          <Link href="/play/character-creation">Create your own Character</Link>
        </Button>
        <LogoutButton />
      </div>
    </main>
  );
}
