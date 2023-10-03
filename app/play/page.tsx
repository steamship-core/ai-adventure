import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography/TypographyH1";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
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
